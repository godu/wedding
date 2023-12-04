

import styles from "./Cartouche.module.css"

export interface Props { }

export const Cartouche: React.FC<Props> = () => {

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 410 310">
      <g id="Calque_1-2" data-name="Calque 1">
        <path className={styles["cls-5"]}
          d="m330.5,5.5c0-.17.01-.33.01-.5H80.49c0,.17.01.33.01.5,0,41.42-33.58,75-75,75-.17,0-.33-.01-.5-.01v149.03c.17,0,.33-.01.5-.01,41.42,0,75,33.58,75,75,0,.17-.01.33-.01.5h250.03c0-.17-.01-.33-.01-.5,0-41.25,33.31-74.72,74.5-74.99V80.49c-41.19-.27-74.5-33.73-74.5-74.99Z" />
        <path className={styles["cls-4"]}
          d="m321.04,15H89.96c-4.38,39.35-35.61,70.58-74.96,74.96v130.08c39.35,4.38,70.58,35.61,74.96,74.96h231.08c4.34-39.02,35.08-70.04,73.96-74.83V89.83c-38.88-4.79-69.62-35.82-73.96-74.83Z" />
        <text className={styles["cls-7"]} transform="translate(113.18 89.79)">
          <tspan className={styles["cls-6"]}>
            <tspan className={styles["cls-1"]} x="0" y="0">TATEVIK</tspan>
          </tspan>
          <tspan className={styles["cls-2"]}>
            <tspan x="21.02" y="24">AROUTUNIAN</tspan>
          </tspan>
        </text>
        <text className={styles["cls-3"]} transform="translate(188.68 162.06)">
          <tspan x="0" y="0">&amp;</tspan>
        </text>
        <text className={styles["cls-7"]} transform="translate(168.28 198.39)">
          <tspan className={styles["cls-2"]}>
            <tspan x="0" y="0">WEBER</tspan>
          </tspan>
          <tspan className={styles["cls-6"]}>
            <tspan className={styles["cls-1"]} x="-49.98" y="48">ARTHUR</tspan>
          </tspan>
        </text>
      </g>
    </svg>
  );
};
