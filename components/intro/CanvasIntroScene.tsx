"use client";

import { useCallback, useEffect, useRef } from "react";

type IntroDocument = {
  label: string;
  amount: string;
  type: string;
  drawer: 0 | 1 | 2 | 3;
  desk: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
};

const DOCUMENTS: IntroDocument[] = [
  { label: "Client Invoice", amount: "$2,400", type: "INVOICE", drawer: 0, desk: 0, offsetX: -36, offsetY: 8, rotation: -0.12 },
  { label: "Sales Receipt", amount: "$950", type: "INCOME", drawer: 0, desk: 0, offsetX: 34, offsetY: 14, rotation: 0.1 },
  { label: "Office Supplies", amount: "$47.20", type: "RECEIPT", drawer: 1, desk: 1, offsetX: -34, offsetY: 8, rotation: 0.1 },
  { label: "Software", amount: "$29.99", type: "EXPENSE", drawer: 1, desk: 1, offsetX: 36, offsetY: 14, rotation: -0.08 },
  { label: "Payroll Run", amount: "$3,200", type: "PAYROLL", drawer: 2, desk: 2, offsetX: -34, offsetY: 8, rotation: -0.08 },
  { label: "CPP / EI", amount: "$412", type: "PAYMENT", drawer: 2, desk: 2, offsetX: 34, offsetY: 14, rotation: 0.12 },
  { label: "GST Remit", amount: "$340", type: "TAX", drawer: 3, desk: 3, offsetX: -34, offsetY: 8, rotation: 0.1 },
  { label: "Bank Deposit", amount: "$1,800", type: "BANK", drawer: 0, desk: 3, offsetX: 34, offsetY: 14, rotation: -0.1 },
  { label: "Mileage Log", amount: "128 km", type: "LOG", drawer: 1, desk: 0, offsetX: 0, offsetY: 28, rotation: 0.04 },
  { label: "Meal Receipt", amount: "$34.50", type: "RECEIPT", drawer: 1, desk: 1, offsetX: 0, offsetY: 28, rotation: -0.04 },
  { label: "Timesheet", amount: "40 hrs", type: "PAYROLL", drawer: 2, desk: 2, offsetX: 0, offsetY: 28, rotation: 0.04 },
  { label: "Tax Notice", amount: "June 2024", type: "TAX", drawer: 3, desk: 3, offsetX: 0, offsetY: 28, rotation: -0.04 },
];

/** Four accountants in a clear left/right arc around the cabinet. */
const ACCOUNTANTS = [
  { x: 0.14, y: 0.58, role: "Ava", shirt: "#2f6f9f", vest: "#1d4f74" },
  { x: 0.28, y: 0.74, role: "Ben", shirt: "#3d8c6d", vest: "#255a47" },
  { x: 0.72, y: 0.74, role: "Mia", shirt: "#b86b3a", vest: "#8a4d28" },
  { x: 0.86, y: 0.58, role: "Sam", shirt: "#6b5cad", vest: "#4a3f7a" },
] as const;

type CanvasIntroSceneProps = {
  phase: number;
  className?: string;
};

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

function easeInOut(value: number): number {
  const t = clamp(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getDeskLayout(width: number, height: number, index: number) {
  const mobile = width < 720;
  if (mobile) {
    // Tight diamond around the cabinet — even gaps, faces stay above the fold.
    const positions = [
      { x: 0.18, y: 0.5 },
      { x: 0.82, y: 0.5 },
      { x: 0.22, y: 0.74 },
      { x: 0.78, y: 0.74 },
    ];
    const spot = positions[index];
    return {
      x: width * spot.x,
      y: height * spot.y,
      scale: clamp(width / 540, 0.72, 1),
      faceLeft: spot.x > 0.5,
    };
  }

  const desk = ACCOUNTANTS[index];
  return {
    x: width * desk.x,
    y: height * desk.y,
    scale: clamp(width / 1180, 0.78, 1.15) * (desk.y > 0.65 ? 1.08 : 0.92),
    faceLeft: index >= 2,
  };
}

export function CanvasIntroScene({ phase, className }: CanvasIntroSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const drawDocument = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      document: IntroDocument,
      rotation: number,
      scale: number,
      alpha: number,
    ) => {
      const width = 112;
      const height = 70;
      const palette =
        document.type === "INCOME" || document.type === "INVOICE" || document.type === "BANK"
          ? ["#d8f6ff", "#68d7ef"]
          : document.type === "PAYROLL" || document.type === "PAYMENT"
            ? ["#eee2ff", "#b992ec"]
            : document.type === "TAX"
              ? ["#ffe7bf", "#f5c842"]
              : ["#fff9dc", "#e7d89d"];

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = palette[0];
      ctx.beginPath();
      ctx.roundRect(-width / 2, -height / 2, width, height, 7);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = palette[1];
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = palette[1];
      ctx.fillRect(-width / 2, -height / 2, width, 16);
      ctx.fillStyle = "#153c31";
      ctx.font = "700 8px Segoe UI, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(document.type, -width / 2 + 8, -height / 2 + 11);
      ctx.font = "600 10px Segoe UI, sans-serif";
      ctx.fillText(document.label, -width / 2 + 8, -2);
      ctx.font = "700 13px Segoe UI, sans-serif";
      ctx.fillStyle = "#2d7057";
      ctx.fillText(document.amount, -width / 2 + 8, 20);
      ctx.restore();
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    let lastPhase = phaseRef.current;
    let phaseStartedAt = performance.now();
    let filingStartedAt = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    };

    const drawAccountant = (
      x: number,
      y: number,
      size: number,
      faceLeft: boolean,
      role: string,
      shirt: string,
      vest: string,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size, size);

      // Soft ground shadow for depth rhythm.
      ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
      ctx.beginPath();
      ctx.ellipse(0, 58, 78, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Desk first so the person clearly sits behind the wood edge.
      const wood = ctx.createLinearGradient(0, -8, 0, 48);
      wood.addColorStop(0, "#c48a52");
      wood.addColorStop(0.45, "#8f5d36");
      wood.addColorStop(1, "#4c2d1c");
      ctx.fillStyle = wood;
      ctx.beginPath();
      ctx.moveTo(-96, -6);
      ctx.lineTo(96, -6);
      ctx.lineTo(78, 40);
      ctx.lineTo(-78, 40);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#e0a86a";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = "#3a2416";
      ctx.fillRect(-70, 40, 14, 46);
      ctx.fillRect(56, 40, 14, 46);
      ctx.fillStyle = "#f5c842";
      ctx.font = "800 9px Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ACCOUNTS", 0, 28);

      // Facing direction only flips the person, never the desk label.
      ctx.save();
      if (faceLeft) ctx.scale(-1, 1);

      // Chair back
      ctx.fillStyle = "#243b34";
      ctx.beginPath();
      ctx.roundRect(-34, -118, 68, 78, 10);
      ctx.fill();

      // Torso — high contrast so it never vanishes into the room.
      const body = ctx.createLinearGradient(0, -110, 0, -10);
      body.addColorStop(0, shirt);
      body.addColorStop(1, vest);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.roundRect(-36, -108, 72, 96, 18);
      ctx.fill();

      // Collar / shirt front
      ctx.fillStyle = "#f4f7f5";
      ctx.beginPath();
      ctx.moveTo(-8, -108);
      ctx.lineTo(0, -78);
      ctx.lineTo(8, -108);
      ctx.closePath();
      ctx.fill();

      // Arms resting on desk
      ctx.fillStyle = shirt;
      ctx.beginPath();
      ctx.ellipse(-46, -18, 16, 11, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(46, -18, 16, 11, 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e6b189";
      ctx.beginPath();
      ctx.arc(-58, -14, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(58, -14, 9, 0, Math.PI * 2);
      ctx.fill();

      // Tiny ledger book on the desk
      ctx.fillStyle = "#f7faf8";
      ctx.beginPath();
      ctx.roundRect(18, -12, 28, 18, 3);
      ctx.fill();
      ctx.strokeStyle = "#2d7057";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#2d7057";
      ctx.fillRect(18, -12, 5, 18);

      // Head
      ctx.fillStyle = "#e6b189";
      ctx.beginPath();
      ctx.arc(0, -128, 26, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = "#3a2a22";
      ctx.beginPath();
      ctx.ellipse(0, -140, 26, 16, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-18, -130, 10, 0, Math.PI * 2);
      ctx.fill();

      // Green eyeshade — classic bookkeeper signal
      ctx.shadowColor = "rgba(80, 255, 181, 0.35)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#3dff9f";
      ctx.beginPath();
      ctx.moveTo(-28, -138);
      ctx.quadraticCurveTo(0, -154, 30, -138);
      ctx.lineTo(20, -124);
      ctx.quadraticCurveTo(0, -132, -22, -124);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#1b4a3a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-28, -138);
      ctx.lineTo(-34, -130);
      ctx.stroke();

      // Glasses
      ctx.strokeStyle = "#1b3c31";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-9, -128, 6, 0, Math.PI * 2);
      ctx.arc(9, -128, 6, 0, Math.PI * 2);
      ctx.moveTo(-3, -128);
      ctx.lineTo(3, -128);
      ctx.stroke();

      // Simple friendly face
      ctx.fillStyle = "#2a1d16";
      ctx.beginPath();
      ctx.arc(-9, -128, 1.8, 0, Math.PI * 2);
      ctx.arc(9, -128, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#2a1d16";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -119, 6, 0.2, Math.PI - 0.2);
      ctx.stroke();

      ctx.restore();

      // Nameplate stays readable left-to-right.
      ctx.fillStyle = "rgba(14, 34, 27, 0.82)";
      ctx.beginPath();
      ctx.roundRect(-34, 46, 68, 20, 8);
      ctx.fill();
      ctx.fillStyle = "#f0f7f4";
      ctx.font = "700 11px Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(role, 0, 60);

      ctx.restore();
    };

    const drawCabinet = (x: number, y: number, scale: number, openAmount: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 18;
      const cabinet = ctx.createLinearGradient(-100, 0, 110, 0);
      cabinet.addColorStop(0, "#183d32");
      cabinet.addColorStop(0.5, "#356f59");
      cabinet.addColorStop(1, "#102c24");
      ctx.fillStyle = cabinet;
      ctx.beginPath();
      ctx.roundRect(-100, -118, 200, 268, 12);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = "#57967c";
      ctx.lineWidth = 3;
      ctx.stroke();

      for (let index = 0; index < 4; index += 1) {
        const drawerY = -98 + index * 60;
        const drawerOpen = openAmount * (1 - index * 0.08);
        const projection = drawerOpen * 48;
        ctx.fillStyle = "#0b211b";
        ctx.fillRect(-82, drawerY + 6, 164, 44);
        const drawer = ctx.createLinearGradient(0, drawerY, 0, drawerY + 48);
        drawer.addColorStop(0, "#477e67");
        drawer.addColorStop(1, "#24513f");
        ctx.fillStyle = drawer;
        ctx.beginPath();
        ctx.roundRect(-86 - projection * 0.05, drawerY - projection * 0.14, 172 + projection * 0.1, 48, 5);
        ctx.fill();
        ctx.strokeStyle = "#68a78b";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#0e281f";
        ctx.beginPath();
        ctx.roundRect(-24, drawerY + 10 - projection * 0.14, 48, 12, 4);
        ctx.fill();
        ctx.fillStyle = "#f5c842";
        ctx.font = "700 8px Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(["INCOME", "EXPENSES", "PAYROLL", "TAXES"][index], 0, drawerY + 35 - projection * 0.14);
      }

      ctx.fillStyle = "#091b16";
      ctx.fillRect(-86, 150, 24, 8);
      ctx.fillRect(62, 150, 24, 8);
      ctx.restore();
    };

    const drawHologram = (x: number, cabinetTop: number, time: number, alpha: number, width: number) => {
      if (alpha <= 0) return;
      const pulse = 1 + Math.sin(time * 0.004) * 0.03;
      const titleSize = clamp(width / 16, 32, 70);
      const titleY = Math.max(64, canvas.clientHeight * (width < 720 ? 0.09 : 0.12));

      ctx.save();
      ctx.globalAlpha = alpha;
      const beam = ctx.createLinearGradient(0, titleY + 24, 0, cabinetTop);
      beam.addColorStop(0, "rgba(77, 255, 207, 0.03)");
      beam.addColorStop(1, "rgba(77, 255, 207, 0.22)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(x - 200, titleY + 16);
      ctx.lineTo(x + 200, titleY + 16);
      ctx.lineTo(x + 64, cabinetTop);
      ctx.lineTo(x - 64, cabinetTop);
      ctx.closePath();
      ctx.fill();

      ctx.translate(x, titleY);
      ctx.scale(pulse, pulse);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 ${titleSize}px Segoe UI, sans-serif`;
      ctx.shadowColor = "#47ffd0";
      ctx.shadowBlur = 24 + Math.sin(time * 0.006) * 8;
      ctx.strokeStyle = "rgba(159, 255, 231, 0.9)";
      ctx.lineWidth = 2;
      ctx.strokeText("LEDGER QUEST", 0, 0);
      ctx.fillStyle = "rgba(83, 255, 211, 0.18)";
      ctx.fillText("LEDGER QUEST", 0, 0);
      ctx.shadowBlur = 0;

      ctx.font = "700 11px Segoe UI, sans-serif";
      ctx.fillStyle = "rgba(181, 255, 237, 0.85)";
      ctx.fillText("BOOKKEEPING  ·  ORGANIZED", 0, titleSize * 0.78);
      ctx.restore();
    };

    const draw = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const currentPhase = phaseRef.current;
      if (currentPhase !== lastPhase) {
        lastPhase = currentPhase;
        phaseStartedAt = time;
        if (currentPhase === 2 && filingStartedAt === 0) filingStartedAt = time;
        if (currentPhase > 2 && filingStartedAt === 0) filingStartedAt = time - 5000;
      }
      const phaseElapsed = time - phaseStartedAt;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const room = ctx.createRadialGradient(width * 0.5, height * 0.42, 24, width * 0.5, height * 0.55, width * 0.78);
      room.addColorStop(0, "#245a48");
      room.addColorStop(0.5, "#12362c");
      room.addColorStop(1, "#071713");
      ctx.fillStyle = room;
      ctx.fillRect(0, 0, width, height);

      // Floor grid — quieter so characters own the rhythm.
      const horizon = height * 0.4;
      ctx.strokeStyle = "rgba(89, 196, 155, 0.08)";
      ctx.lineWidth = 1;
      for (let index = -6; index <= 6; index += 1) {
        ctx.beginPath();
        ctx.moveTo(width * 0.5, horizon);
        ctx.lineTo(width * 0.5 + index * width * 0.14, height);
        ctx.stroke();
      }
      for (let y = horizon; y < height; y += Math.max(40, (y - horizon) * 0.2)) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const openTarget = currentPhase >= 1 && currentPhase < 4 ? 1 : 0;
      const openAmount =
        openTarget === 1 ? easeInOut(phaseElapsed / 900) : currentPhase >= 4 ? 1 - easeInOut(phaseElapsed / 850) : 0;

      // Cabinet is the centerpiece but leaves side lanes for accountants.
      const mobile = width < 720;
      const cabinetScale = clamp(width / (mobile ? 1050 : 1280), mobile ? 0.46 : 0.52, mobile ? 0.68 : 0.88);
      const cabinetX = width * 0.5;
      const cabinetY = height * (mobile ? 0.42 : 0.56);

      // Back-row accountants first, then cabinet, then front-row for depth.
      [0, 3].forEach((index) => {
        const layout = getDeskLayout(width, height, index);
        const person = ACCOUNTANTS[index];
        drawAccountant(layout.x, layout.y, layout.scale, layout.faceLeft, person.role, person.shirt, person.vest);
      });

      drawCabinet(cabinetX, cabinetY, cabinetScale, openAmount);

      [1, 2].forEach((index) => {
        const layout = getDeskLayout(width, height, index);
        const person = ACCOUNTANTS[index];
        drawAccountant(layout.x, layout.y, layout.scale, layout.faceLeft, person.role, person.shirt, person.vest);
      });

      const retract = currentPhase >= 4 ? 1 - easeInOut(phaseElapsed / 700) : 1;
      const hologramAlpha = currentPhase >= 1 && currentPhase < 5 ? openAmount * retract : 0;
      drawHologram(cabinetX, cabinetY - 118 * cabinetScale, time, hologramAlpha, width);

      DOCUMENTS.forEach((document, index) => {
        const layout = getDeskLayout(width, height, document.desk);
        const docScale = clamp(width / 1500, 0.48, 0.82);
        // Park papers on the desk surface — never over faces.
        const originX = layout.x + document.offsetX * docScale;
        const originY = layout.y - 4 * layout.scale + document.offsetY * docScale;
        const flight =
          currentPhase >= 2
            ? easeInOut(clamp((time - filingStartedAt - index * 320) / 1150))
            : 0;
        // Before filing starts, only show one lead document per desk so faces stay readable.
        if (currentPhase < 2 && index % 3 !== 0) return;
        if (flight >= 0.995 || currentPhase >= 4) return;

        // Stagger flight lanes so papers don't pile on the same arc.
        const lane = (index % 4) - 1.5;
        const controlX = (originX + cabinetX) / 2 + lane * (mobile ? 28 : 64);
        const controlY = Math.min(originY, cabinetY) - height * 0.16 - (index % 3) * 18;
        const inverse = 1 - flight;
        const targetY = cabinetY + (-90 + document.drawer * 60) * cabinetScale;
        const x = inverse * inverse * originX + 2 * inverse * flight * controlX + flight * flight * cabinetX;
        const y = inverse * inverse * originY + 2 * inverse * flight * controlY + flight * flight * targetY;
        const flutter = Math.sin(time * 0.004 + index) * (1 - flight) * 2.5;
        const scale = docScale * (1 - flight * 0.42);
        drawDocument(
          ctx,
          x,
          y + flutter,
          document,
          document.rotation * (1 - flight) + Math.sin(flight * Math.PI) * 0.1,
          scale,
          1 - clamp((flight - 0.85) / 0.15),
        );
      });

      if (currentPhase >= 2 && currentPhase < 4) {
        const filedCount = Math.min(DOCUMENTS.length, Math.max(0, Math.floor((time - filingStartedAt) / 300)));
        ctx.textAlign = "center";
        ctx.font = "700 12px Segoe UI, sans-serif";
        ctx.fillStyle = "rgba(181, 255, 237, 0.88)";
        ctx.fillText(`Filing documents  ${filedCount} / ${DOCUMENTS.length}`, cabinetX, height - 22);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [drawDocument]);

  return <canvas ref={canvasRef} className={`h-full w-full ${className ?? ""}`} aria-hidden="true" />;
}
