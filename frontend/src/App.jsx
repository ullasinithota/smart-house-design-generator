import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const colors = [
  "#bfdbfe",
  "#bbf7d0",
  "#fde68a",
  "#fbcfe8",
  "#ddd6fe",
  "#fed7aa",
];

function House3D({ plot, rooms, showRoof }) {
  const width = plot.width;
  const length = plot.length;
  const floorCount = plot.floors || 1;
  const wallHeight = 7;
  const floorHeight = 9;
  const wallThickness = 0.22;

  const Wall = ({ position, size, color = "#d8d1c7" }) => (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
  );

  const Box = ({ position, size, color }) => (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.72} />
    </mesh>
  );

  const Cylinder = ({ position, args, color }) => (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );

  function RoomFurniture({ room, baseY }) {
    const cx = room.x + room.w / 2 - width / 2;
    const cz = length / 2 - (room.y + room.d / 2);
    const y = baseY + 0.22;
    const small = Math.min(room.w, room.d);
    const name = room.name.toLowerCase();

    // BEDROOM FURNITURE
    if (name.includes("bedroom")) {
      const bedW = Math.min(room.w * 0.58, 6.4);
      const bedD = Math.min(room.d * 0.62, 5.2);
      const bedZ = cz + 0.15;

      return (
        <group>
          {/* Bed frame */}
          <Box
            position={[cx, y + 0.45, bedZ]}
            size={[bedW + 0.25, 0.45, bedD + 0.25]}
            color="#795548"
          />

          {/* Mattress */}
          <Box
            position={[cx, y + 0.78, bedZ]}
            size={[bedW, 0.28, bedD]}
            color="#f8fafc"
          />

          {/* Pillows */}
          <Box
            position={[cx - bedW * 0.23, y + 0.96, bedZ - bedD * 0.3]}
            size={[bedW * 0.34, 0.16, 0.72]}
            color="#93c5fd"
          />

          <Box
            position={[cx + bedW * 0.23, y + 0.96, bedZ - bedD * 0.3]}
            size={[bedW * 0.34, 0.16, 0.72]}
            color="#93c5fd"
          />

          {/* Headboard */}
          <Box
            position={[cx, y + 0.78, bedZ - bedD / 2 - 0.18]}
            size={[bedW + 0.25, 1.25, 0.28]}
            color="#5b4636"
          />

          {/* Bedside tables */}
          <Box
            position={[cx - bedW * 0.62, y + 0.35, bedZ - bedD * 0.32]}
            size={[0.9, 0.7, 0.9]}
            color="#a87950"
          />

          <Box
            position={[cx + bedW * 0.62, y + 0.35, bedZ - bedD * 0.32]}
            size={[0.9, 0.7, 0.9]}
            color="#a87950"
          />

          {/* Wardrobe */}
          <Box
            position={[cx + room.w * 0.34, y + 1.15, cz + room.d * 0.27]}
            size={[1.15, 2.3, Math.min(2.8, room.d * 0.32)]}
            color="#b88961"
          />
        </group>
      );
    }

    // LIVING ROOM FURNITURE
    if (name.includes("living")) {
      const sofaW = Math.min(room.w * 0.42, 8);
      const sofaD = Math.min(room.d * 0.34, 2.5);

      return (
        <group>
          {/* Sofa seat */}
          <Box
            position={[cx - room.w * 0.12, y + 0.55, cz + room.d * 0.12]}
            size={[sofaW, 0.65, sofaD]}
            color="#477b69"
          />

          {/* Sofa back */}
          <Box
            position={[
              cx - room.w * 0.12,
              y + 1.05,
              cz + room.d * 0.12 - sofaD * 0.4,
            ]}
            size={[sofaW, 0.9, 0.42]}
            color="#315f51"
          />

          {/* Sofa arms */}
          <Box
            position={[
              cx - room.w * 0.12 - sofaW / 2 + 0.2,
              y + 0.82,
              cz + room.d * 0.12,
            ]}
            size={[0.42, 0.9, sofaD]}
            color="#315f51"
          />

          <Box
            position={[
              cx - room.w * 0.12 + sofaW / 2 - 0.2,
              y + 0.82,
              cz + room.d * 0.12,
            ]}
            size={[0.42, 0.9, sofaD]}
            color="#315f51"
          />

          {/* Coffee table */}
          <Box
            position={[cx + room.w * 0.2, y + 0.35, cz + room.d * 0.12]}
            size={[3.2, 0.35, 1.8]}
            color="#a87950"
          />

          {/* TV console */}
          <Box
            position={[cx, y + 0.65, cz - room.d * 0.36]}
            size={[Math.min(room.w * 0.36, 7), 1, 0.65]}
            color="#654b3b"
          />

          {/* Television */}
          <Box
            position={[cx, y + 1.45, cz - room.d * 0.36 + 0.12]}
            size={[Math.min(room.w * 0.3, 5.8), 1.25, 0.12]}
            color="#202a35"
          />
        </group>
      );
    }

    // KITCHEN FURNITURE
    if (name.includes("kitchen")) {
      const counterW = Math.min(room.w * 0.78, 10);
      const counterD = Math.min(room.d * 0.34, 2.2);

      return (
        <group>
          {/* Kitchen cabinets */}
          <Box
            position={[cx, y + 1, cz + room.d * 0.25]}
            size={[counterW, 1.65, counterD]}
            color="#b88961"
          />

          {/* Countertop */}
          <Box
            position={[cx, y + 1.88, cz + room.d * 0.25]}
            size={[counterW + 0.12, 0.16, counterD + 0.12]}
            color="#e5e7eb"
          />

          {/* Cabinet doors */}
          {[-0.32, 0, 0.32].map((offset) => (
            <Box
              key={offset}
              position={[
                cx + offset * counterW,
                y + 0.95,
                cz + room.d * 0.25 - counterD / 2 - 0.015,
              ]}
              size={[counterW * 0.27, 1.1, 0.08]}
              color="#d6a879"
            />
          ))}

          {/* Stove */}
          <Box
            position={[cx - counterW * 0.27, y + 2, cz + room.d * 0.25]}
            size={[1.7, 0.08, 1.4]}
            color="#374151"
          />

          {/* Sink */}
          <Cylinder
            position={[cx + counterW * 0.25, y + 2, cz + room.d * 0.25]}
            args={[0.48, 0.48, 0.08, 24]}
            color="#94a3b8"
          />

          {/* Refrigerator */}
          <Box
            position={[cx - room.w * 0.36, y + 1.45, cz - room.d * 0.22]}
            size={[1.8, 2.8, 1.8]}
            color="#dbe4ea"
          />
        </group>
      );
    }

    // BATHROOM FURNITURE
    if (name.includes("bathroom")) {
      return (
        <group>
          {/* Toilet */}
          <Cylinder
            position={[cx - small * 0.2, y + 0.42, cz + 0.5]}
            args={[0.62, 0.72, 0.65, 24]}
            color="#f8fafc"
          />

          {/* Toilet tank */}
          <Box
            position={[cx - small * 0.2, y + 0.85, cz + 0.05]}
            size={[1.15, 0.95, 0.45]}
            color="#ffffff"
          />

          {/* Washbasin cabinet */}
          <Box
            position={[cx + small * 0.22, y + 0.55, cz - 0.55]}
            size={[1.8, 1, 1.25]}
            color="#9b7653"
          />

          {/* Washbasin */}
          <Cylinder
            position={[cx + small * 0.22, y + 1.1, cz - 0.55]}
            args={[0.58, 0.58, 0.16, 24]}
            color="#f8fafc"
          />

          {/* Shower tray */}
          <Box
            position={[cx + small * 0.2, y + 0.12, cz + room.d * 0.3]}
            size={[1.7, 0.18, 1.6]}
            color="#bfdbfe"
          />
        </group>
      );
    }

    return null;
  }

  return (
    <>
      <color attach="background" args={["#eaf2f8"]} />

      <ambientLight intensity={1.35} />

      <directionalLight
        position={[width, 35, length]}
        intensity={2.4}
        castShadow
      />

      <hemisphereLight args={["#ffffff", "#b8c5d3", 0.65]} />

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.35, 0]}
        receiveShadow
      >
        <planeGeometry args={[width + 18, length + 18]} />
        <meshStandardMaterial color="#dce8d5" />
      </mesh>

      {Array.from({ length: floorCount }, (_, floor) => {
        const baseY = floor * floorHeight;
        const wallY = baseY + wallHeight / 2;
        const isTopFloor = floor === floorCount - 1;

        return (
          <group key={floor}>
            {/* Floor slab */}
            <mesh position={[0, baseY, 0]} receiveShadow>
              <boxGeometry args={[width, 0.35, length]} />
              <meshStandardMaterial color="#c8b59b" />
            </mesh>

            {/* Room floors */}
            {rooms.map((room, i) => (
              <mesh
                key={`${floor}-${room.name}-floor`}
                position={[
                  room.x + room.w / 2 - width / 2,
                  baseY + 0.19,
                  length / 2 - (room.y + room.d / 2),
                ]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry
                  args={[
                    Math.max(0.2, room.w - 0.25),
                    Math.max(0.2, room.d - 0.25),
                  ]}
                />
                <meshStandardMaterial
                  color={colors[i % colors.length]}
                  side={2}
                />
              </mesh>
            ))}

            {/* Exterior walls */}
            <Wall
              position={[0, wallY, -length / 2]}
              size={[width, wallHeight, wallThickness]}
            />

            <Wall
              position={[-width / 2, wallY, 0]}
              size={[wallThickness, wallHeight, length]}
            />

            <Wall
              position={[width / 2, wallY, 0]}
              size={[wallThickness, wallHeight, length]}
            />

            {/* Open front walls */}
            <Wall
              position={[-width * 0.39, wallY, length / 2]}
              size={[width * 0.22, wallHeight, wallThickness]}
            />

            <Wall
              position={[width * 0.39, wallY, length / 2]}
              size={[width * 0.22, wallHeight, wallThickness]}
            />

            {/* Room partitions */}
            {rooms.map((room, i) => {
              const x = room.x - width / 2;
              const z = length / 2 - room.y - room.d;
              const bottomEdge = z + room.d;

              return (
                <group key={`${floor}-${room.name}-walls`}>
                  {i > 0 && (
                    <Wall
                      position={[x, wallY, z + room.d / 2]}
                      size={[
                        wallThickness,
                        wallHeight * 0.62,
                        room.d,
                      ]}
                      color="#c9bba9"
                    />
                  )}

                  {i > 0 && (
                    <Wall
                      position={[x + room.w / 2, wallY, bottomEdge]}
                      size={[
                        room.w,
                        wallHeight * 0.62,
                        wallThickness,
                      ]}
                      color="#c9bba9"
                    />
                  )}
                </group>
              );
            })}

            {/* Furniture */}
            {rooms.map((room) => (
              <RoomFurniture
                key={`${floor}-${room.name}-furniture`}
                room={room}
                baseY={baseY}
              />
            ))}

            {/* Windows */}
            <mesh position={[-width / 2 + 0.08, baseY + 4.5, 0]}>
              <boxGeometry
                args={[0.14, 2.2, Math.min(length * 0.22, 5)]}
              />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>

            <mesh position={[width / 2 - 0.08, baseY + 4.5, 0]}>
              <boxGeometry
                args={[0.14, 2.2, Math.min(length * 0.22, 5)]}
              />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>

            {/* Roof */}
            {showRoof && isTopFloor && (
              <mesh
                position={[0, baseY + wallHeight + 0.25, 0]}
                castShadow
                receiveShadow
              >
                <boxGeometry
                  args={[width + 0.8, 0.5, length + 0.8]}
                />
                <meshStandardMaterial color="#64748b" />
              </mesh>
            )}
          </group>
        );
      })}

      <gridHelper
        args={[
          Math.max(width, length) + 12,
          24,
          "#94a3b8",
          "#cbd5e1",
        ]}
        position={[0, -0.25, 0]}
      />

      <OrbitControls
  makeDefault
  target={[0, floorCount * floorHeight * 0.28, 0]}
  minDistance={8}
  maxDistance={Math.max(width, length) * 2}
/>
    </>
  );
}

export default function App() {
  const [width, setWidth] = useState(32);
  const [length, setLength] = useState(24);
  const [bedrooms, setBedrooms] = useState(2);
  const [floors, setFloors] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRoof, setShowRoof] = useState(false);

  async function generateDesign(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            width,
            length,
            bedrooms,
            floors,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not generate design.");
      }

      setResult(data);
    } catch (err) {
      setError(
        `Unable to generate the design: ${err.message}. ` +
          "Check that your Flask backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold tracking-[0.25em] text-blue-600">
            SMART HOUSE DESIGNER
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Design Your Dream Home
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Enter your plot measurements to explore personalized
            house layouts in 2D and 3D.
          </p>
        </header>

        {/* Input Form */}
        <form
          onSubmit={generateDesign}
          className="mx-auto mb-8 grid max-w-3xl grid-cols-1 gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/50 sm:grid-cols-2 sm:p-8"
        >
          <label className="text-sm font-semibold">
            Plot Width (feet)

            <input
              className={inputClass}
              type="number"
              min="15"
              max="100"
              required
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </label>

          <label className="text-sm font-semibold">
            Plot Length (feet)

            <input
              className={inputClass}
              type="number"
              min="15"
              max="150"
              required
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </label>

          <label className="text-sm font-semibold">
            Bedrooms

            <select
              className={inputClass}
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} bedroom{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold">
            Floors

            <select
              className={inputClass}
              value={floors}
              onChange={(e) => setFloors(Number(e.target.value))}
            >
              {[1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {n} floor{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60 sm:col-span-2"
          >
            {loading
              ? "Generating your design..."
              : "Generate House Design"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Generated Result */}
        {result && (
          <>
            {/* Overview */}
            <section className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-5 text-xl font-bold">
                Design Overview
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-blue-50 p-5">
                  <p className="text-sm text-slate-500">Plot size</p>

                  <p className="mt-2 text-xl font-bold text-blue-700">
                    {result.plot.width} × {result.plot.length} ft
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-5">
                  <p className="text-sm text-slate-500">Plot area</p>

                  <p className="mt-2 text-xl font-bold text-emerald-700">
                    {result.plot.area} sq ft
                  </p>
                </div>

                <div className="rounded-2xl bg-violet-50 p-5">
                  <p className="text-sm text-slate-500">Configuration</p>

                  <p className="mt-2 text-xl font-bold text-violet-700">
                    {bedrooms} bed · {floors} floor
                    {floors > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </section>

            {/* 2D and 3D Sections */}
            <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">

              {/* 2D Floor Plan */}
              <article className="min-w-0 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                <h2 className="text-xl font-bold">
                  2D Floor Plan
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Conceptual room arrangement with approximate dimensions.
                </p>

                <svg
                  viewBox={`0 0 ${width} ${length}`}
                  className="mt-5 block max-h-[560px] w-full rounded-xl border border-slate-200 bg-slate-50"
                  role="img"
                  aria-label="Conceptual house floor plan"
                >
                  <rect
                    x="0.3"
                    y="0.3"
                    width={width - 0.6}
                    height={length - 0.6}
                    fill="white"
                    stroke="#0f172a"
                    strokeWidth="0.55"
                  />

                  {result.rooms.map((room, i) => (
                    <g key={room.name}>
                      <rect
                        x={room.x}
                        y={room.y}
                        width={room.w}
                        height={room.d}
                        fill={colors[i % colors.length]}
                        stroke="#334155"
                        strokeWidth="0.25"
                      />

                      <text
                        x={room.x + room.w / 2}
                        y={room.y + room.d / 2 - 0.25}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={Math.min(width, length) * 0.035}
                        fill="#172033"
                      >
                        {room.name}
                      </text>

                      <text
                        x={room.x + room.w / 2}
                        y={room.y + room.d / 2 + 0.65}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={Math.min(width, length) * 0.025}
                        fill="#334155"
                      >
                        {room.w.toFixed(1)} × {room.d.toFixed(1)} ft
                      </text>
                    </g>
                  ))}

                  {(result.doors || []).map((door, i) => (
                    <g key={`door-${i}`}>
                      <line
                        x1={door.x - 1.5}
                        y1={door.y}
                        x2={door.x + 1.5}
                        y2={door.y}
                        stroke="#92400e"
                        strokeWidth="0.35"
                      />

                      <text
                        x={door.x}
                        y={door.y - 0.45}
                        textAnchor="middle"
                        fontSize={Math.min(width, length) * 0.025}
                        fill="#92400e"
                      >
                        Door
                      </text>
                    </g>
                  ))}

                  {(result.windows || []).map((window, i) => (
                    <g key={`window-${i}`}>
                      {window.wall === "front" && (
                        <line
                          x1={window.x - 1.2}
                          y1={window.y}
                          x2={window.x + 1.2}
                          y2={window.y}
                          stroke="#0284c7"
                          strokeWidth="0.4"
                        />
                      )}

                      {(window.wall === "left" ||
                        window.wall === "right") && (
                        <line
                          x1={window.x}
                          y1={window.y - 1.2}
                          x2={window.x}
                          y2={window.y + 1.2}
                          stroke="#0284c7"
                          strokeWidth="0.4"
                        />
                      )}
                    </g>
                  ))}
                </svg>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                  <span>🟦 Rooms</span>
                  <span className="text-amber-800">━━ Door marker</span>
                  <span className="text-sky-600">━━ Window markers</span>
                </div>

                <h3 className="mb-3 mt-6 font-bold">
                  Room Dimensions
                </h3>

                <div className="space-y-2">
                  {result.rooms.map((room) => (
                    <div
                      key={room.name}
                      className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 text-sm"
                    >
                      <span>{room.name}</span>

                      <span className="font-semibold">
                        {room.w.toFixed(1)} × {room.d.toFixed(1)} ft
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              {/* 3D House Model */}
              <article className="min-w-0 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">
                      3D House Model
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Drag to rotate and scroll to zoom.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowRoof((value) => !value)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {showRoof ? "Hide roof" : "Show roof"}
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  For a clearer interior view, keep the roof hidden.
                </p>

                <div className="mt-5 h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-sky-50 sm:h-[520px]">
                  <Canvas
                    shadows
                    camera={{
                      position: [
                        width * 1.05,
                        length * 1.2,
                        length * 1.55,
                      ],
                      fov: 40,
                      near: 0.1,
                      far: 1000,
                    }}
                  >
                    <House3D
                      plot={{ ...result.plot, floors }}
                      rooms={result.rooms}
                      showRoof={showRoof}
                    />
                  </Canvas>
                </div>
              </article>
            </section>

            {/* Disclaimer */}
            <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              This is a conceptual visualization, not a construction-ready
              architectural plan. Room partitions and furniture are
              approximate. Consult a qualified architect and structural
              engineer before construction.
            </p>
          </>
        )}

        <footer className="mt-12 text-center text-sm text-slate-400">
          Smart House Designer · Built with React, Tailwind CSS and Flask
        </footer>
      </div>
    </main>
  );
}