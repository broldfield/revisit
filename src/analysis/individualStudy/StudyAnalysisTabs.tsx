import {
  Alert, AppShell, Container, Flex, LoadingOverlay, Space, Tabs, Title,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import {
  IconChartDonut2, IconPlayerPlay, IconTable, IconSettings,
  IconInfoCircle,
} from '@tabler/icons-react';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import AppHeader from '../interface/AppHeader';
import { GlobalConfig, ParticipantData, StudyConfig } from '../../parser/types';
import { getStudyConfig } from '../../utils/fetchConfig';
import { TableView } from './table/TableView';
import { useStorageEngine } from '../../storage/storageEngineHooks';
import ManageAccordion from './management/ManageAccordion';
import { useAuth } from '../../store/hooks/useAuth';
import { ParticipantStatusBadges } from '../interface/ParticipantStatusBadges';
import { StatsView } from './stats/StatsView';
import AllReplays from './replay/AllReplays';
import { parseStudyConfig } from '../../parser/parser';

export function StudyAnalysisTabs({ globalConfig }: { globalConfig: GlobalConfig; }) {
  const { studyId } = useParams();
  const [expData, setExpData] = useState<ParticipantData[]>([]);
  const [studyConfig, setStudyConfig] = useState<StudyConfig | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { storageEngine } = useStorageEngine();
  const navigate = useNavigate();
  const { tab } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!studyId) return () => { };
    if (studyId === 'revisit-widget') {
      const messageListener = async (event: MessageEvent) => {
        if (event.data.type === 'revisitWidget/CONFIG' && storageEngine) {
          const cf = await parseStudyConfig(event.data.payload);
          setStudyConfig(cf);
        }
      };

      window.addEventListener('message', messageListener);
      window.parent.postMessage({ type: 'revisitWidget/READY' }, '*');
      return () => {
        window.removeEventListener('message', messageListener);
      };
    }
    getStudyConfig(studyId, globalConfig).then((cf) => {
      if (cf) {
        setStudyConfig(cf);
      }
    });

    return () => { };
  }, [studyId, globalConfig, storageEngine]);

  const getData = useCallback(async () => {
    setLoading(true);
    if (studyId) {
      if (!studyConfig || !storageEngine) return;
      await storageEngine.initializeStudyDb(studyId, studyConfig);
      const data = (await storageEngine.getAllParticipantsData());
      setExpData(data);
      setLoading(false);
    }
  }, [storageEngine, studyId, studyConfig]);

  useEffect(() => {
    getData();
  }, [globalConfig, storageEngine, studyId, getData]);

  const [completed, inProgress, rejected] = useMemo(() => {
    const comp = expData.filter((d) => !d.rejected && d.completed);
    const prog = expData.filter((d) => !d.rejected && !d.completed);
    const rej = expData.filter((d) => d.rejected);
    return [comp, prog, rej];
  }, [expData]);

  return (
    <>
      <AppHeader studyIds={globalConfig.configsList} />

      <AppShell.Main>
        <Container fluid style={{ height: '100%', position: 'relative' }}>
          <LoadingOverlay visible={loading} />

          <Flex direction="row" align="center">
            <Title order={5}>{studyId}</Title>
            <ParticipantStatusBadges completed={completed.length} inProgress={inProgress.length} rejected={rejected.length} />
          </Flex>

          <Space h="xs" />

          <Tabs variant="outline" value={tab} onChange={(value) => navigate(`/analysis/stats/${studyId}/${value}`)} style={{ height: '100%' }}>
            <Tabs.List>
              <Tabs.Tab value="table" leftSection={<IconTable size={16} />}>Table View</Tabs.Tab>
              <Tabs.Tab value="stats" leftSection={<IconChartDonut2 size={16} />}>Trial Stats</Tabs.Tab>
              <Tabs.Tab value="replay" leftSection={<IconPlayerPlay size={16} />}>Participant Replay</Tabs.Tab>
              <Tabs.Tab value="manage" leftSection={<IconSettings size={16} />} disabled={!user.isAdmin}>Manage</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="table" pt="xs">
              {studyConfig && <TableView completed={completed} inProgress={inProgress} rejected={rejected} studyConfig={studyConfig} refresh={getData} />}
            </Tabs.Panel>
            <Tabs.Panel value="stats" pt="xs">
              {studyConfig && <StatsView studyConfig={studyConfig} completed={completed} inprogress={inProgress} rejected={rejected} />}
            </Tabs.Panel>
            <Tabs.Panel value="replay" pt="xs">
              <AllReplays />
            </Tabs.Panel>
            <Tabs.Panel value="manage" pt="xs">
              {studyId && user.isAdmin ? <ManageAccordion studyId={studyId} refresh={getData} /> : <Container mt={20}><Alert title="Unauthorized Access" variant="light" color="red" icon={<IconInfoCircle />}>You are not authorized to manage the data for this study.</Alert></Container>}
            </Tabs.Panel>
          </Tabs>
        </Container>
      </AppShell.Main>
    </>
  );
}
