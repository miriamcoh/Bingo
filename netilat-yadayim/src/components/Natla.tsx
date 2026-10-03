import React from "react";
import { COLORS } from "./Kid";

// The natla (washing cup with two handles), centered on (0, 0).
// Hands grab it at (±NATLA_GRIP_X, NATLA_GRIP_Y).
// Water pours from the rim corner at (±NATLA_LIP_X, NATLA_LIP_Y).
export const NATLA_GRIP_X = 42;
export const NATLA_GRIP_Y = -4;
export const NATLA_LIP_X = 31;
export const NATLA_LIP_Y = -32;

const Handle: React.FC<{ flip: boolean }> = ({ flip }) => (
  <path
    d="M 27 -22 C 52 -24 54 14 25 12"
    transform={flip ? "scale(-1 1)" : undefined}
    stroke={COLORS.outline}
    strokeWidth={12}
    fill="none"
    strokeLinecap="round"
  />
);

const HandleFill: React.FC<{ flip: boolean }> = ({ flip }) => (
  <path
    d="M 27 -22 C 52 -24 54 14 25 12"
    transform={flip ? "scale(-1 1)" : undefined}
    stroke="#E9B44C"
    strokeWidth={6}
    fill="none"
    strokeLinecap="round"
  />
);

export const Natla: React.FC<{ water: number }> = ({ water }) => (
  <g>
    <Handle flip={false} />
    <Handle flip />
    <HandleFill flip={false} />
    <HandleFill flip />
    <path
      d="M -31 -32 L 31 -32 L 25 30 Q 0 37 -25 30 Z"
      fill="#F2C14E"
      stroke={COLORS.outline}
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path
      d="M -28.5 -8 Q 0 -2 28.5 -8"
      stroke="#D9932E"
      strokeWidth={6}
      fill="none"
    />
    <path
      d="M -27 6 Q 0 12 27 6"
      stroke="#D9932E"
      strokeWidth={3}
      fill="none"
    />
    <path
      d="M -18 -24 L -15 24"
      stroke="#FFF1C2"
      strokeWidth={6}
      strokeLinecap="round"
      opacity={0.8}
    />
    <ellipse
      cx={0}
      cy={-32}
      rx={31}
      ry={6}
      fill={water > 0.05 ? "#58B9F2" : "#B9822B"}
      stroke={COLORS.outline}
      strokeWidth={3.5}
    />
    {water > 0.05 ? (
      <ellipse cx={-8} cy={-33} rx={10} ry={2} fill="white" opacity={0.7} />
    ) : null}
  </g>
);
