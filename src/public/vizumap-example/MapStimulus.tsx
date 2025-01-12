import { Box, Text, Grid, Center } from "@mantine/core";
import { StimulusParams } from "../../store/types";

export default function MapStimulus({
  parameters,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
StimulusParams<any>) {
  const { description, mapData } = parameters;
  return (
    <Center>
      <Box style={{ minWidth: "fit-content" }}>
        <Text size="lg" fw={700} style={{ marginBottom: "10px" }}>
          Trial
        </Text>
        <Text style={{ marginBottom: "10px", width: "900px" }}>
          {description.text}
        </Text>
        <Grid>
          <Grid.Col span={10}>
            <div style={{ minHeight: mapData.height }}>
              <iframe
                width={mapData.width}
                height={mapData.height}
                style={{ border: "0px" }}
                src={mapData.mapFileLocation}
                title={mapData.title}
              />
            </div>
          </Grid.Col>

          <Grid.Col span={1}>
            <div style={{ minHeight: mapData.keyHeight }}>
              <iframe
                width={mapData.keyWidth}
                height={mapData.keyHeight}
                style={{ border: "0px" }}
                src={mapData.keyFileLocation}
                title={mapData.title}
              />
            </div>
          </Grid.Col>
        </Grid>
        <Text style={{ marginBottom: "10px", width: "900px" }}>
          {description.textUnder}
        </Text>
      </Box>
    </Center>
  );
}
