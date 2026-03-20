import { Text, Image, View, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { appConfig } from "@repo/app-config";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Line,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Mask,
  Rect,
  G,
} from "react-native-svg";

function PerspectiveGrid() {
  const { width, height: screenH } = useWindowDimensions();
  const gridH = screenH * 0.55;
  const cols = 16;
  const rows = 10;
  const cellSize = 80;
  const svgW = cols * cellSize;
  const svgH = rows * cellSize;
  const renderW = width * 1.4;

  const hLines = [];
  for (let i = 0; i <= rows; i++) hLines.push(i * cellSize);
  const vLines = [];
  for (let i = 0; i <= cols; i++) vLines.push(i * cellSize);

  return (
    <View
      className="absolute inset-x-0 bottom-0 items-center overflow-hidden"
      style={{ height: gridH }}
    >
      <View
        style={{
          width: renderW,
          height: gridH,
          transform: [{ perspective: 600 }, { rotateX: "55deg" }],
        }}
      >
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="none"
        >
          <Defs>
            <SvgLinearGradient id="fadeV" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="white" stopOpacity="1" />
              <Stop offset="35%" stopColor="white" stopOpacity="0" />
            </SvgLinearGradient>
            <Mask id="gridMask">
              <Rect width={svgW} height={svgH} fill="white" />
              <Rect width={svgW} height={svgH} fill="url(#fadeV)" />
            </Mask>
          </Defs>
          <G mask="url(#gridMask)">
            {hLines.map((y, i) => (
              <Line
                key={`h-${i}`}
                x1={0}
                y1={y}
                x2={svgW}
                y2={y}
                stroke="#3b82f6"
                strokeWidth="1.2"
                opacity={0.2}
              />
            ))}
            {vLines.map((x, i) => (
              <Line
                key={`v-${i}`}
                x1={x}
                y1={0}
                x2={x}
                y2={svgH}
                stroke="#3b82f6"
                strokeWidth="1.2"
                opacity={0.2}
              />
            ))}
          </G>
        </Svg>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={["#EBF2FF", "#F5F8FF", "#FFFFFF"]}
      locations={[0, 0.5, 1]}
      className="flex-1 items-center justify-center"
    >
      <PerspectiveGrid />
      <View className="z-10 items-center">
        <Image
          source={require("../../assets/blueprint_3d.png")}
          className="h-80 w-80"
          resizeMode="contain"
        />
        <Text className="mt-6 text-2xl font-bold">{t("appName")}</Text>
        <Text className="mt-2 text-gray-500">{appConfig.slogan}</Text>
      </View>
    </LinearGradient>
  );
}
