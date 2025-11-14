import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputSection } from './components/InputSection/InputSection';
import { ResultSection } from './components/ResultSection/ResultSection';
import { DetailModal } from './components/DetailModal';
import { useStore } from './store/useStore';

function App() {
  const { selectedPlan, selectPlan } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <main className="py-12 px-4">
        <InputSection />
        <ResultSection />
      </main>

      <Footer />

      {selectedPlan && (
        <DetailModal plan={selectedPlan} onClose={() => selectPlan(null)} />
      )}
    </div>
  );
}

export default App;
