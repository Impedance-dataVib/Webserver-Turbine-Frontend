export interface ITrendsData {
  cylinder_specific_indicators: any[];
  trends: Trend[];
  alert: any[];
  alertUpdatedOn: string;
}

export interface Trend {
  trendsName: string;
  speedName: string;
  min: number;
  max: number;
  yMax: number;
  avg: number;
  datapoints: number[];
  dataPointsY1: number[];
  dataPointsY2: number[];
  labels: string[];
  chartType: string;
  yLabel: string;
  xLabel: string;
  isGradientOpposite: boolean;
}

export type IModuleTabs = {
  id: number;
  name: string;
  description: string;
  configuration_id: number;
  created_date: string;
  modified_date: string;
  process_name: string;
  module_type: string;
  from_data: string;
}

export interface IWebSocketData {
  isAlert: boolean;
  alertsUpdatedOn: string;
  alertData: {
    instructionName: string;
    instructionType: string;
    instructions: string[];
  }[];
  globalIndicator: GlobalIndicator[];
  trends: {
    trendsName: string;
    min: number;
    max: number;
    avg: number;
    datapoints: number[];
    labels: string[];
    chartType: string;
    xLabel: string;
    yLabel: string;
  }[];
  currentStatus: CurrentStatus;
  liveStatus: LiveStatus;
  signals: Signals;
}

export interface GlobalIndicator {
  indicatorName:
    | "Speed"
    | "Regularity/Deviation"
    | "Bearing Status"
    | "Shaft/Blade Health"
    | "Coupling"
    | "Combustion Kit";
  indicatorMin: number;
  indicatorMax: number;
  indicatorValue: number;
  isPercentage: boolean;
  indicatorUnit: string;
  isGradientColor: boolean;
  indicatorType: string;
}

export interface CurrentStatus {
  title: string;
  icon: string;
  iconColor: string;
}

export interface LiveStatus {
  currentStep: number;
  currentMode: string;
  stepProgress: number;
  currentMessage: string;
}

export interface Signals {
  crankShaft: number;
  tdc: number;
}

export type ICSSClasses = Record<string, string>;
