'use client';

import { Lock } from 'lucide-react';
import { useMemo, useState } from 'react';

const intrigueMessages = [
  'Che, ¿qué hacés espiando? Esto es solo para la muchachada del grupo.',
  'Tranqui, capo, el contenido es más secreto que la receta de la abuela.',
  'Acá adentro pasan cosas... pero solo si sos del grupo, ¿viste?',
  '¿Querés chusmear? Primero hacete miembro, no seas gil.',
  'Sumate al grupo y dejá de mirar desde afuera como un colado.',
  'No seas botón, unite y enterate de todo.',
  'Esto está más cerrado que el kiosco un domingo a la siesta.',
  '¿Te pensás que esto es la casa de Gran Hermano? Solo para miembros, papá.',
];

const titleMessages = [
  'El contenido está más guardado que el Fernet en la heladera',
  'Solo para miembros, maestro',
  'Solo para miembros, papá',
  'Solo para miembros, ¿viste?',
];

function getRandomMessage() {
  return intrigueMessages[Math.floor(Math.random() * intrigueMessages.length)];
}

function getRandomTitleMessages() {
  return titleMessages[Math.floor(Math.random() * titleMessages.length)];
}

export default function NotGroupMember() {
  const [scale, setScale] = useState<number>(1);
  const [styles, setStyles] = useState<React.CSSProperties>({});

  const handleClick = () => {
    setScale(scale + 0.1);
    setStyles({
      transform: `scale(${scale})`,
    });
  };

  const title = useMemo(() => {
    return getRandomTitleMessages();
  }, []);

  const message = useMemo(() => {
    return getRandomMessage();
  }, []);

  console.log(scale);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[320px] rounded-xl overflow-hidden bg-background shadow-lg">
      <div className="absolute inset-0 backdrop-blur-md bg-background/80 z-10" />
      <div className="relative z-20 flex flex-col items-center gap-4 p-8">
        <Lock className="h-12 w-12 text-primary animate-pulse" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-foreground text-center drop-shadow">{title}</h2>
        <p className="text-lg text-muted-foreground text-center max-w-md">{message}</p>
        <button
          className="cursor-pointer mt-4 px-6 py-2 rounded-lg bg-muted text-foreground font-semibold shadow transition-transform duration-500"
          style={styles}
          onClick={handleClick}
        >
          {scale > 3 ? 'Puto el que lee' : 'Solo para miembros, maestro'}
        </button>
      </div>
    </div>
  );
}
