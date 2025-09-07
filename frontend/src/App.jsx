
import './App.css'
import FlipBook from './components/Flipbook';

const samplePages = [
  { content: "📖 Cover Page", color: "bg-yellow-200" },
  { content: "✨ Page 1: Intro", color: "bg-green-200" },
  { content: "🛠 Page 2: Features", color: "bg-blue-200" },
  { content: "🚀 Page 3: Deployment", color: "bg-pink-200" },
  { content: "✨ Page 1: Intro", color: "bg-green-200" },
  { content: "🛠 Page 2: Features", color: "bg-blue-200" },
  { content: "🚀 Page 3: Deployment", color: "bg-pink-200" },
  { content: "🏁 The End", color: "bg-red-200" },
]


export default function App() {

  return (
    <>
      <FlipBook pages={samplePages}/>
    </>
  );
}

