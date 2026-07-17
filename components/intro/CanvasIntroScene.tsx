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
  { label: "Client Invoice", amount: "$2,400", type: "INVOICE", drawer: 0, desk: 0, offsetX: -42, offsetY: 8, rotation: -0.14 },
  { label: "Sales Receipt", amount: "$950", type: "INCOME", drawer: 0, desk: 0, offsetX: 22, offsetY: -4, rotation: 0.1 },
  { label: "Office Supplies", amount: "$47.20", type: "RECEIPT", drawer: 1, desk: 1, offsetX: -38, offsetY: 6, rotation: 0.12 },
  { label: "Software", amount: "$29.99", type: "EXPENSE", drawer: 1, desk: 1, offsetX: 30, offsetY: 9, rotation: -0.1 },
  { label: "Payroll Run", amount: "$3,200", type: "PAYROLL", drawer: 2, desk: 2, offsetX: -34, offsetY: 2, rotation: -0.08 },
  { label: "CPP / EI", amount: "$412", type: "PAYMENT", drawer: 2, desk: 2, offsetX: 34, offsetY: 10, rotation: 0.14 },
  { label: "GST Remit", amount: "$340", type: "TAX", drawer: 3, desk: 3, offsetX: -36, offsetY: 4, rotation: 0.1 },
  { label: "Bank Deposit", amount: "$1,800", type: "BANK", drawer: 0, desk: 3, offsetX: 30, offsetY: -3, rotation: -0.12 },
  { label: "Mileage Log", amount: "128 km", type: "LOG", drawer: 1, desk: 0, offsetX: 4, offsetY: 20, rotation: 0.04 },
  { label: "Meal Receipt", amount: "$34.50", type: "RECEIPT", drawer: 1, desk: 1, offsetX: 2, offsetY: 23, rotation: -0.05 },
  { label: "Timesheet", amount: "40 hrs", type: "PAYROLL", drawer: 2, desk: 2, offsetX: 0, offsetY: 22, rotation: 0.04 },
  { label: "Tax Notice", amount: "June 2024", type: "TAX", drawer: 3, desk: 3, offsetX: 0, offsetY: 22, rotation: -0.04 },
];

const DESK_POSITIONS = [
  { x: 0.12, y: 0.55 },
  { x: 0.28, y: 0.76 },
  { x: 0.72, y: 0.76 },
  { x: 0.88, y: 0.55 },
];

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
      const width = 106;
      const height = 66;
      const palette =
        document.type === "INCOME" || document.type === "INVOICE"
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
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 9;
      ctx.fillStyle = palette[0];
      ctx.beginPath();
      ctx.roundRect(-width / 2, -height / 2, width, height, 6);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = palette[1];
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = palette[1];
      ctx.fillRect(-width / 2, -height / 2, width, 15);
      ctx.fillStyle = "#153c31";
      ctx.font = "700 8px Segoe UI, sans-serif";
      ctx.fillText(document.type, -width / 2 + 7, -height / 2 + 11);
      ctx.font = "600 9px Segoe UI, sans-serif";
      ctx.fillText(document.label, -width / 2 + 7, -4);
      ctx.font = "700 12px Segoe UI, sans-serif";
      ctx.fillStyle = "#2d7057";
      ctx.fillText(document.amount, -width / 2 + 7, 18);
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

    const drawAccountant = (x: number, y: number, size: number, mirror: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(mirror ? -size : size, size);

      // Body and head behind the desk.
      ctx.fillStyle = "#122f27";
      ctx.beginPath();
      ctx.ellipse(0, -56, 30, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#dba77d";
      ctx.beginPath();
      ctx.arc(0, -100, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#403229";
      ctx.beginPath();
      ctx.arc(0, -105, 22, Math.PI, Math.PI * 2);
      ctx.fill();

      // Classic accountant's green eyeshade.
      ctx.shadowColor = "rgba(80, 255, 181, 0.45)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#3dff9f";
      ctx.beginPath();
      ctx.moveTo(-26, -109);
      ctx.quadraticCurveTo(0, -123, 28, -109);
      ctx.lineTo(18, -96);
      ctx.quadraticCurveTo(0, -103, -20, -96);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#183f32";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-26, -109);
      ctx.lineTo(-31, -103);
      ctx.stroke();

      // Desk in perspective.
      const wood = ctx.createLinearGradient(0, -35, 0, 35);
      wood.addColorStop(0, "#8f5d36");
      wood.addColorStop(1, "#4c2d1c");
      ctx.fillStyle = wood;
      ctx.beginPath();
      ctx.moveTo(-88, -34);
      ctx.lineTo(88, -34);
      ctx.lineTo(72, 28);
      ctx.lineTo(-72, 28);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#b77b47";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#382116";
      ctx.fillRect(-65, 28, 11, 42);
      ctx.fillRect(54, 28, 11, 42);

      ctx.fillStyle = "#f5c842";
      ctx.font = "700 8px Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ACCOUNTS", 0, 18);
      ctx.restore();
    };

    const drawCabinet = (x: number, y: number, scale: number, openAmount: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 24;
      const cabinet = ctx.createLinearGradient(-100, 0, 110, 0);
      cabinet.addColorStop(0, "#183d32");
      cabinet.addColorStop(0.5, "#356f59");
      cabinet.addColorStop(1, "#102c24");
      ctx.fillStyle = cabinet;
      ctx.beginPath();
      ctx.roundRect(-112, -126, 224, 292, 12);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = "#57967c";
      ctx.lineWidth = 3;
      ctx.stroke();

      for (let index = 0; index < 4; index += 1) {
        const drawerY = -104 + index * 67;
        const drawerOpen = openAmount * (1 - index * 0.08);
        const projection = drawerOpen * 54;
        ctx.fillStyle = "#0b211b";
        ctx.fillRect(-92, drawerY + 7, 184, 49);
        const drawer = ctx.createLinearGradient(0, drawerY, 0, drawerY + 54);
        drawer.addColorStop(0, "#477e67");
        drawer.addColorStop(1, "#24513f");
        ctx.fillStyle = drawer;
        ctx.beginPath();
        ctx.roundRect(-96 - projection * 0.05, drawerY - projection * 0.14, 192 + projection * 0.1, 54, 5);
        ctx.fill();
        ctx.strokeStyle = "#68a78b";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#0e281f";
        ctx.beginPath();
        ctx.roundRect(-28, drawerY + 11 - projection * 0.14, 56, 13, 4);
        ctx.fill();
        ctx.fillStyle = "#f5c842";
        ctx.font = "700 8px Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(["INCOME", "EXPENSES", "PAYROLL", "TAXES"][index], 0, drawerY + 39 - projection * 0.14);
      }

      ctx.fillStyle = "#091b16";
      ctx.fillRect(-96, 166, 28, 9);
      ctx.fillRect(68, 166, 28, 9);
      ctx.restore();
    };

    const drawHologram = (x: number, cabinetTop: number, time: number, alpha: number) => {
      if (alpha <= 0) return;
      const pulse = 1 + Math.sin(time * 0.004) * 0.035;
      const titleSize = clamp(canvas.clientWidth / 14, 58, 116);
      const titleY = Math.max(92, canvas.clientHeight * 0.15);

      ctx.save();
      ctx.globalAlpha = alpha;
      const beam = ctx.createLinearGradient(0, titleY + 30, 0, cabinetTop);
      beam.addColorStop(0, "rgba(77, 255, 207, 0.04)");
      beam.addColorStop(1, "rgba(77, 255, 207, 0.3)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(x - 260, titleY + 20);
      ctx.lineTo(x + 260, titleY + 20);
      ctx.lineTo(x + 80, cabinetTop);
      ctx.lineTo(x - 80, cabinetTop);
      ctx.closePath();
      ctx.fill();

      ctx.translate(x, titleY);
      ctx.scale(pulse, pulse);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 ${titleSize}px Segoe UI, sans-serif`;
      ctx.shadowColor = "#47ffd0";
      ctx.shadowBlur = 32 + Math.sin(time * 0.006) * 12;
      ctx.strokeStyle = "rgba(159, 255, 231, 0.9)";
      ctx.lineWidth = 2;
      ctx.strokeText("LEDGERQUEST", 0, 0);
      ctx.fillStyle = "rgba(83, 255, 211, 0.2)";
      ctx.fillText("LEDGERQUEST", 0, 0);
      ctx.shadowBlur = 0;

      ctx.font = "700 12px Segoe UI, sans-serif";
      ctx.fillStyle = "rgba(181, 255, 237, 0.85)";
      ctx.fillText("BOOKKEEPING // ORGANIZED", 0, titleSize * 0.72);

      ctx.strokeStyle = "rgba(117, 255, 220, 0.24)";
      ctx.lineWidth = 1;
      for (let scan = -titleSize * 0.62; scan < titleSize * 0.62; scan += 8) {
        ctx.beginPath();
        ctx.moveTo(-titleSize * 4.9, scan);
        ctx.lineTo(titleSize * 4.9, scan);
        ctx.stroke();
      }
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

      const room = ctx.createRadialGradient(width * 0.5, height * 0.48, 20, width * 0.5, height * 0.52, width * 0.72);
      room.addColorStop(0, "#1c4b3b");
      room.addColorStop(0.48, "#102f26");
      room.addColorStop(1, "#071713");
      ctx.fillStyle = room;
      ctx.fillRect(0, 0, width, height);

      // Floor perspective and restrained environmental rhythm.
      const horizon = height * 0.44;
      ctx.strokeStyle = "rgba(89, 196, 155, 0.1)";
      ctx.lineWidth = 1;
      for (let index = -8; index <= 8; index += 1) {
        ctx.beginPath();
        ctx.moveTo(width * 0.5, horizon);
        ctx.lineTo(width * 0.5 + index * width * 0.12, height);
        ctx.stroke();
      }
      for (let y = horizon; y < height; y += Math.max(32, (y - horizon) * 0.18)) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const openTarget = currentPhase >= 1 && currentPhase < 4 ? 1 : 0;
      const openAmount =
        openTarget === 1 ? easeInOut(phaseElapsed / 900) : currentPhase >= 4 ? 1 - easeInOut(phaseElapsed / 850) : 0;
      const cabinetScale = clamp(width / 1050, 0.62, 1.05);
      const cabinetX = width * 0.5;
      const cabinetY = height * 0.61;

      DESK_POSITIONS.forEach((desk, index) => {
        const responsiveX = width < 700 ? (index < 2 ? 0.17 + index * 0.18 : 0.65 + (index - 2) * 0.18) : desk.x;
        const responsiveY = width < 700 ? (index % 2 === 0 ? 0.58 : 0.77) : desk.y;
        const deskScale = clamp(width / 1500, 0.42, 0.82) * (responsiveY > 0.65 ? 1.05 : 0.9);
        drawAccountant(width * responsiveX, height * responsiveY, deskScale, index >= 2);
      });

      drawCabinet(cabinetX, cabinetY, cabinetScale, openAmount);

      const retract = currentPhase >= 4 ? 1 - easeInOut(phaseElapsed / 700) : 1;
      const hologramAlpha = currentPhase >= 1 && currentPhase < 5 ? openAmount * retract : 0;
      drawHologram(cabinetX, cabinetY - 126 * cabinetScale, time, hologramAlpha);

      DOCUMENTS.forEach((document, index) => {
        const desk = DESK_POSITIONS[document.desk];
        const responsiveX =
          width < 700
            ? document.desk < 2
              ? 0.17 + document.desk * 0.18
              : 0.65 + (document.desk - 2) * 0.18
            : desk.x;
        const responsiveY = width < 700 ? (document.desk % 2 === 0 ? 0.58 : 0.77) : desk.y;
        const originX = width * responsiveX + document.offsetX * clamp(width / 1400, 0.42, 0.8);
        const originY = height * responsiveY - 35 + document.offsetY * clamp(width / 1400, 0.42, 0.8);
        const flight =
          currentPhase >= 2
            ? easeInOut(clamp((time - filingStartedAt - index * 270) / 980))
            : 0;
        if (flight >= 0.995 || currentPhase >= 4) return;

        const controlX = (originX + cabinetX) / 2 + (document.desk < 2 ? 80 : -80);
        const controlY = Math.min(originY, cabinetY) - height * 0.22 - (index % 3) * 18;
        const inverse = 1 - flight;
        const targetY = cabinetY + (-96 + document.drawer * 67) * cabinetScale;
        const x = inverse * inverse * originX + 2 * inverse * flight * controlX + flight * flight * cabinetX;
        const y = inverse * inverse * originY + 2 * inverse * flight * controlY + flight * flight * targetY;
        const flutter = Math.sin(time * 0.004 + index) * (1 - flight) * 4;
        const scale = clamp(width / 1500, 0.48, 0.86) * (1 - flight * 0.45);
        drawDocument(
          ctx,
          x,
          y + flutter,
          document,
          document.rotation * (1 - flight) + Math.sin(flight * Math.PI) * 0.12,
          scale,
          1 - clamp((flight - 0.85) / 0.15),
        );
      });

      if (currentPhase >= 2 && currentPhase < 4) {
        const filedCount = Math.min(DOCUMENTS.length, Math.max(0, Math.floor((time - filingStartedAt) / 270)));
        ctx.textAlign = "center";
        ctx.font = "700 11px Segoe UI, sans-serif";
        ctx.fillStyle = "rgba(181, 255, 237, 0.8)";
        ctx.fillText(`FILING DOCUMENTS  ${filedCount} / ${DOCUMENTS.length}`, cabinetX, height - 38);
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
