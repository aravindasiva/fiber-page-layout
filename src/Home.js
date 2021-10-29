import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'

function useWobble(factor = 1, fn = 'sin', cb) {
  const ref = useRef()
  useFrame(state => {
    const t = state.clock.getElapsedTime()
    ref.current.position.y = Math[fn](t) * factor
    if (cb) cb(t, ref.current)
  })
  return ref
}

export function Box(props) {
  const [hovered, set] = useState(false)
  const ref = useWobble(0.5, 'cos')
  useFrame(() => (ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z += 0.01))
  return (
    <mesh ref={ref} {...props} onPointerOver={() => set(true)} onPointerOut={() => set(false)}>
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'white'} />
    </mesh>
  )
}

export function Shapes() {
  const {
    viewport: { width, height }
  } = useThree()
  const ringSize = Math.max(3, width / 2)
  const crossSize = 0.7
  return (
    <>
      <Ring position={[-width * 0.8, height * -3, -5]} scale={[ringSize, ringSize, 1]} />
      <Cross position={[-width / 2.5, height / 8, -1]} scale={[crossSize, crossSize, 1]} rotation={[0, 0, Math.PI / 4]} />
      <Minus position={[width / 3, -height / 3.5, -2]} scale={[0.8, 0.8, 0.8]} rotation={[0, 0, Math.PI / 10]} />
      <group rotation={[Math.PI / 8, 0, 0]} position={[-width / 4, -height / 6, 0]}>
        <Box scale={[0.8, 0.8, 0.8]} />
        <Box position={[width / 1.5, height / 4, -3]} scale={[0.5, 0.5, 0.5]} />
        <Lights />
      </group>
    </>
  )
}

function Ring(props) {
  return (
    <mesh {...props}>
      <ringBufferGeometry attach="geometry" args={[1, 1.4, 64]} />
      <meshBasicMaterial attach="material" color="#FFF9BE" transparent opacity={1} toneMapped={false} />
    </mesh>
  )
}

function Cross(props) {
  const inner = useRef()
  const ref = useWobble(0.1, 'sin', () => (inner.current.rotation.z += 0.001))
  return (
    <group ref={ref}>
      <group ref={inner} {...props}>
        <mesh>
          <planeBufferGeometry attach="geometry" args={[2, 0.5]} />
          <meshBasicMaterial attach="material" color="#FFEDDD" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.625, 0]}>
          <planeBufferGeometry attach="geometry" args={[0.5, 0.75]} />
          <meshBasicMaterial attach="material" color="#FFEDDD" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.625, 0]}>
          <planeBufferGeometry attach="geometry" args={[0.5, 0.75]} />
          <meshBasicMaterial attach="material" color="#FFEDDD" toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function Minus(props) {
  const ref = useWobble(0.1, 'sin')
  return (
    <group ref={ref}>
      <group {...props}>
        <mesh>
          <planeBufferGeometry attach="geometry" args={[2, 0.7]} />
          <meshBasicMaterial attach="material" color="#DEF5FF" toneMapped={false} transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[7, -5, 10]} intensity={1} angle={0.3} penumbra={1} />
      <pointLight position={[1, -1, -5]} intensity={0.5} />
    </>
  )
}

export function Categories({ time = 3000 }) {
  const [index, set] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => set((index + 1) % 2), time)
    return () => clearInterval(interval)
  }, [index])
  const cats = useMemo(
    () => [
      { npm: 'headless', description: 'programmatic CAD workflow for the web.' },
      { npm: 'react', description: 'interactive CAD workflow for React.' }
    ],
    []
  )

  const ref = useRef()
  useEffect(() => {
    ref.current.style.animation = 'none'
    void ref.current.offsetHeight
    ref.current.style.animation = `changewidth ${time / 1000}s linear`
  }, [index])

  return (
    <p style={{ height: 70 }}>
      <a href="#" style={{ width: 190 }} onClick={() => set((index + 1) % 2)}>
        <div
          ref={ref}
          className="progress"
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 2,
            opacity: 0.5,
            background: '#ffa5a5'
          }}
        />
        @buerli.io/
        {cats.map(({ npm }, i) => (
          <span key={i} hidden={i !== index || undefined} className="transition vertical">
            {npm}
          </span>
        ))}
      </a>
      is a non-manifold,
      <br />
      {cats.map(({ description }, i) => (
        <span key={i} hidden={i !== index || undefined} className="transition horizontal" style={{ width: '100%', left: 0 }}>
          {description}
        </span>
      ))}
    </p>
  )
}
