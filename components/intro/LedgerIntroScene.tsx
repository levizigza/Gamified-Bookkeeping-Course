"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const RECEIPTS = [
  { label: "INVOICE", amount: "$2,400", color: "#d8efff", category: 0, start: [-5.2, 2.8, -0.4] },
  { label: "DEPOSIT", amount: "+$1,800", color: "#d8f5e7", category: 0, start: [4.9, 2.1, 0.3] },
  { label: "RECEIPT", amount: "$47.20", color: "#fff7d6", category: 1, start: [-4.5, -2.2, 1] },
  { label: "EXPENSE", amount: "$29.99", color: "#ffe1df", category: 1, start: [5.3, -1.9, -0.2] },
  { label: "PAYROLL", amount: "$3,200", color: "#eee1ff", category: 2, start: [-1.2, 3.4, 0.8] },
  { label: "CPP / EI", amount: "$412", color: "#eadfff", category: 2, start: [2.1, -3.2, 0.5] },
  { label: "GST", amount: "$340", color: "#fff1c7", category: 3, start: [-5.6, 0.2, -0.5] },
  { label: "TAX", amount: "$680", color: "#ffe9be", category: 3, start: [5.8, 0.4, 0.7] },
] as const;

const CATEGORIES = ["Income", "Expenses", "Payroll", "Taxes"] as const;

function makeReceiptTexture(label: string, amount: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 240;
  const context = canvas.getContext("2d")!;
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#ffffff";
  context.lineWidth = 8;
  context.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  context.fillStyle = "#1b3c31";
  context.font = "700 28px Segoe UI";
  context.fillText(label, 28, 52);
  context.font = "800 42px Segoe UI";
  context.fillStyle = amount.startsWith("-") ? "#b83232" : "#255a47";
  context.fillText(amount, 28, 118);
  context.strokeStyle = "rgba(37,90,71,.25)";
  context.setLineDash([10, 8]);
  context.beginPath();
  context.moveTo(28, 154);
  context.lineTo(356, 154);
  context.stroke();
  context.font = "20px monospace";
  context.fillStyle = "#3d8c6d";
  context.fillText("BRIGHT PATH • JUN 2024", 28, 202);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function LabelBillboard({
  text,
  position,
  color = "#f0f7f4",
}: {
  text: string;
  position: [number, number, number];
  color?: string;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.font = "700 56px Segoe UI";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [color, text]);

  return (
    <sprite position={position} scale={[1.4, 0.35, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

function ReceiptCard({
  receipt,
  phase,
  index,
}: {
  receipt: (typeof RECEIPTS)[number];
  phase: number;
  index: number;
}) {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(
    () => makeReceiptTexture(receipt.label, receipt.amount, receipt.color),
    [receipt],
  );
  const start = useMemo(() => new THREE.Vector3(...receipt.start), [receipt]);
  const sorted = useMemo(
    () => new THREE.Vector3(-2.7 + receipt.category * 1.8, -0.55 + (index % 2) * 0.55, 0.55),
    [index, receipt.category],
  );
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;
    if (phase === 0) {
      target.copy(start);
      target.x += Math.sin(time * 0.55 + index) * 0.35;
      target.y += Math.cos(time * 0.48 + index * 0.7) * 0.28;
      group.current.rotation.z = Math.sin(time * 0.4 + index) * 0.22;
      group.current.rotation.y = Math.cos(time * 0.3 + index) * 0.18;
    } else if (phase === 1) {
      target.set(0, 0.25 + (index % 3) * 0.08, 0.35 + index * 0.025);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.06);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.06);
    } else {
      target.copy(sorted);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.08);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.08);
    }
    group.current.position.lerp(target, phase === 0 ? 0.04 : 0.075);
    const scale = phase >= 2 ? 0.58 : phase === 1 ? 0.74 : 1;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.06);
  });

  return (
    <group ref={group} position={start}>
      <mesh castShadow>
        <planeGeometry args={[1.55, 0.96]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.03]} castShadow>
        <boxGeometry args={[1.55, 0.96, 0.05]} />
        <meshStandardMaterial color="#d7e7df" roughness={0.85} metalness={0} />
      </mesh>
    </group>
  );
}

function LedgerMachine({ phase }: { phase: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const scale = phase >= 1 ? 1 : 0.001;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);
  });

  return (
    <group ref={group} position={[0, -1.35, -0.45]} scale={0.001}>
      <mesh receiveShadow>
        <boxGeometry args={[7.8, 0.32, 2.35]} />
        <meshStandardMaterial color="#102d25" metalness={0.35} roughness={0.4} />
      </mesh>
      {[0, 1, 2, 3].map((slot) => (
        <group key={slot} position={[-2.7 + slot * 1.8, 0.23, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.55, 0.18, 1.95]} />
            <meshStandardMaterial
              color={["#3d8c6d", "#d67d66", "#9b7ed1", "#e8b020"][slot]}
              emissive={["#183b2f", "#3d1712", "#23173c", "#493406"][slot]}
              emissiveIntensity={0.35}
              metalness={0.2}
              roughness={0.45}
            />
          </mesh>
          {phase >= 2 && (
            <LabelBillboard text={CATEGORIES[slot]} position={[0, 0.42, 1.05]} />
          )}
        </group>
      ))}
      <mesh position={[0, -0.18, 0]} receiveShadow>
        <boxGeometry args={[8.2, 0.1, 2.75]} />
        <meshStandardMaterial color="#e8b020" metalness={0.45} roughness={0.3} />
      </mesh>
    </group>
  );
}

function BalanceScale({ phase }: { phase: number }) {
  const group = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current || !beam.current) return;
    const scale = phase >= 3 ? 1 : 0.001;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.09);
    beam.current.rotation.z = THREE.MathUtils.lerp(beam.current.rotation.z, 0, 0.08);
  });
  return (
    <group ref={group} position={[0, 0.55, 1.2]} scale={0.001}>
      <mesh position={[0, -0.8, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.18, 1.8, 24]} />
        <meshStandardMaterial color="#e8b020" metalness={0.65} roughness={0.25} />
      </mesh>
      <group ref={beam} rotation={[0, 0, 0.24]}>
        <mesh castShadow>
          <boxGeometry args={[4.8, 0.12, 0.12]} />
          <meshStandardMaterial color="#f5c842" metalness={0.6} roughness={0.25} />
        </mesh>
        {[-2.05, 2.05].map((x, i) => (
          <group key={x} position={[x, -0.55, 0]}>
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.62, 8]} />
              <meshStandardMaterial color="#8fc5ad" />
            </mesh>
            <mesh castShadow>
              <cylinderGeometry args={[0.75, 0.58, 0.12, 32]} />
              <meshStandardMaterial color="#2d7057" metalness={0.3} roughness={0.35} />
            </mesh>
            <LabelBillboard
              text={i === 0 ? "Assets" : "L + E"}
              position={[0, -0.35, 0.2]}
              color="#f5c842"
            />
          </group>
        ))}
      </group>
    </group>
  );
}

function SuccessGraph({ phase }: { phase: number }) {
  const group = useRef<THREE.Group>(null);
  const heights = [0.45, 0.7, 1.0, 1.25, 1.55];
  useFrame(() => {
    if (!group.current) return;
    const scale = phase >= 4 ? 1 : 0.001;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  });
  return (
    <group ref={group} position={[-1.6, 0.15, 1.45]} scale={0.001}>
      {heights.map((height, index) => (
        <mesh key={height} position={[index * 0.55, height / 2, 0]} castShadow>
          <boxGeometry args={[0.4, height, 0.35]} />
          <meshStandardMaterial
            color="#3d8c6d"
            emissive="#1b3c31"
            emissiveIntensity={0.3}
            roughness={0.45}
          />
        </mesh>
      ))}
    </group>
  );
}

function SuccessMark({ phase }: { phase: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const scale = phase >= 4 ? 1 : 0.001;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  });
  return (
    <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.25}>
      <group ref={group} position={[0, 1.35, 1.85]} scale={0.001}>
        <mesh castShadow>
          <torusGeometry args={[0.78, 0.1, 20, 64]} />
          <meshStandardMaterial color="#f5c842" emissive="#8a6508" emissiveIntensity={0.45} metalness={0.55} />
        </mesh>
        <mesh position={[-0.17, -0.05, 0.06]} rotation={[0, 0, -0.77]} castShadow>
          <boxGeometry args={[0.11, 0.6, 0.11]} />
          <meshStandardMaterial color="#f5c842" emissive="#8a6508" emissiveIntensity={0.45} />
        </mesh>
        <mesh position={[0.2, 0.03, 0.06]} rotation={[0, 0, 0.72]} castShadow>
          <boxGeometry args={[0.11, 1.05, 0.11]} />
          <meshStandardMaterial color="#f5c842" emissive="#8a6508" emissiveIntensity={0.45} />
        </mesh>
      </group>
    </Float>
  );
}

function ViewportSync() {
  const { gl, setSize } = useThree();
  useFrame(() => {
    const canvas = gl.domElement;
    const parent = canvas.parentElement;
    if (!parent) return;
    const width = parent.clientWidth || window.innerWidth;
    const height = parent.clientHeight || window.innerHeight;
    if (canvas.clientWidth !== width || canvas.clientHeight !== height) {
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      setSize(width, height);
    }
  });
  return null;
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.28;
    state.camera.position.y = 0.35 + Math.cos(state.clock.elapsedTime * 0.1) * 0.12;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function SceneContent({ phase }: { phase: number }) {
  return (
    <>
      <color attach="background" args={["#0e221b"]} />
      <CameraRig />
      <ViewportSync />
      <ambientLight intensity={0.45} />
      <directionalLight castShadow position={[4, 7, 6]} intensity={1.15} color="#fff8ec" />
      <pointLight position={[-4, 2, 4]} intensity={1.2} distance={14} color="#5fa888" />
      <pointLight position={[4, 1, 3]} intensity={0.9} distance={12} color="#e8b020" />
      {phase >= 4 && (
        <Sparkles count={40} scale={[12, 7, 5]} size={1.8} speed={0.2} opacity={0.25} color="#8fc5ad" />
      )}
      <LedgerMachine phase={phase} />
      {RECEIPTS.map((receipt, index) => (
        <ReceiptCard
          key={`${receipt.label}-${receipt.amount}`}
          receipt={receipt}
          phase={phase}
          index={index}
        />
      ))}
      <BalanceScale phase={phase} />
      <SuccessGraph phase={phase} />
      <SuccessMark phase={phase} />
    </>
  );
}

type LedgerIntroSceneProps = {
  phase: number;
  className?: string;
};

export function LedgerIntroScene({ phase, className }: LedgerIntroSceneProps) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    >
      <Canvas
        shadows
        flat
        dpr={[1, 2]}
        resize={{ scroll: false, debounce: { resize: 0, scroll: 0 } }}
        camera={{ position: [0, 0.4, 9], fov: 48, near: 0.1, far: 50 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0e221b", 1);
          const canvas = gl.domElement;
          const parent = canvas.parentElement;
          if (parent) {
            parent.style.position = "absolute";
            parent.style.inset = "0";
            parent.style.width = "100%";
            parent.style.height = "100%";
          }
          const applySize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.setSize(width, height, true);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
          };
          applySize();
          window.addEventListener("resize", applySize);
        }}
      >
        <SceneContent phase={phase} />
      </Canvas>
    </div>
  );
}
