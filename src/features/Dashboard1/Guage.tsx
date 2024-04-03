import GaugeComponent from "react-gauge-component";

type GuageProps = {
  value: number;
};

const Guage = ({ value }: GuageProps) => {
  return (
    <div className="w-full flex justify-center items-center">
      <GaugeComponent
        type="semicircle"
        style={{ width: "fit-content" }}
        arc={{
          width: 0.25,
          padding: 0.005,
          cornerRadius: 1,
          gradient: true,
          subArcs: [
            {
              limit: 0,
              color: "#F44B15",
              showTick: true,
            },
            {
              limit: 25,
              color: "#F48015",
              showTick: true,
            },
            {
              limit: 50,
              color: "#F48E15",
              showTick: true,
            },
            {
              limit: 75,
              color: "#F4B615",
              showTick: true,
            },
            {
              limit: 100,
              color: "#5FC50F",
            },
          ],
        }}
        pointer={{
          color: "#345243",
          length: 0.8,
          width: 10,
          elastic: true,
        }}
        labels={{
          valueLabel: {
            formatTextValue: (value) => value,
            style: {
              fill: "#000",
              textShadow: "none",
              fontSize: "22px",
            },
          },
        }}
        value={value}
        minValue={0}
        maxValue={100}
      />
    </div>
  );
};

export default Guage;
