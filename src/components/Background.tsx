
import "./Background.css"

export interface Props { }

export const Background: React.FC<Props> = () => {

  return (
    <svg viewBox="0 0 101 101" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="Palmes" x="0" y="0" width="101" height="101" patternUnits="userSpaceOnUse">
          <g xmlns="http://www.w3.org/2000/svg">
            <rect className={"cls-2"} x=".5" y=".5" width="100" height="100" />
            <path className={"cls-3"} d="m80.5.5c0,19.5-.5,20.5-20,40,19.5-19.5,20.5-20,40-20V.5h-20Z" />
            <line className={"cls-1"} x1="60.5" y1="40.5" x2=".5" y2="100.5" />
            <path className={"cls-1"} d="m.5,100.5C20,81,20.5,80,20.5.5" />
            <path className={"cls-1"} d="m40.5.5c0,59.5-.39,60.5-20,80" />
            <path className={"cls-1"} d="m60.5.5c0,39.5-.5,40.5-20,60" />
            <path className={"cls-1"} d="m80.5.5c0,19.5-.5,20.5-20,40" />
            <path className={"cls-1"} d="m.5,100.5c19.5-19.5,20.5-20,100-20" />
            <path className={"cls-1"} d="m100.5,60.5c-59.5,0-60.5.39-80,20" />
            <path className={"cls-1"} d="m100.5,40.5c-39.5,0-40.5.5-60,20" />
            <path className={"cls-1"} d="m100.5,20.5c-19.5,0-20.5.5-40,20" />
            <rect className={"cls-1"} x=".5" y=".5" width="100" height="100" />
          </g>
        </pattern>
        <pattern id="Palmes2" patternTransform="rotate(315) scale(.05 .05)" xlinkHref="#Palmes" xmlnsXlink="http://www.w3.org/1999/xlink" />
      </defs>
      <rect className="cls-5" width="101" height="101" />
    </svg>
  );

};
