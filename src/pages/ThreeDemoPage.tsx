import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeScene from '../components/ThreeScene';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

const ThreeDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTreasure, setSelectedTreasure] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleTreasureClick = (treasureId: string) => {
    setSelectedTreasure(treasureId);
    setShowAlert(true);
    
    // Simular efeito de coleta
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleBackToMap = () => {
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Demonstração 3D - Capão do Tesouro
          </h1>
          <p className="text-gray-600">
            Explore tesouros em uma experiência 3D imersiva
          </p>
        </div>

        {/* Alerta de interação */}
        {showAlert && (
          <div className="mb-6">
            <Alert 
              variant="success" 
              title="Tesouro Encontrado!"
              message="Você descobriu um tesouro 3D! +100 pontos"
              onClose={() => setShowAlert(false)}
            />
          </div>
        )}

        {/* Cena 3D Principal */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Cena 3D Interativa
            </h2>
            <div className="flex justify-center">
              <ThreeScene 
                width={600}
                height={400}
                onTreasureClick={handleTreasureClick}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                💡 Dica: Mova o mouse ou toque para rotacionar o tesouro
              </p>
              <p className="text-sm text-gray-600">
                🖱️ Clique no tesouro para coletá-lo
              </p>
            </div>
          </div>
        </Card>

        {/* Informações do Tesouro Selecionado */}
        {selectedTreasure && (
          <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🏆 Tesouro 3D Descoberto!
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Detalhes:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ID: {selectedTreasure}</li>
                    <li>• Tipo: Tesouro Demonstration</li>
                    <li>• Valor: +100 pontos</li>
                    <li>• Raridade: Comum</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Estatísticas:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Total Coletados: 1</li>
                    <li>• Nível Atual: 12</li>
                    <li>• Pontos Totais: 2,550</li>
                    <li>• Próximo Nível: 500 pts</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Benefícios da Tecnologia 3D */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🚀 Benefícios da Experiência 3D
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🎨</div>
                <h3 className="font-medium text-gray-800 mb-1">Visualização Rica</h3>
                <p className="text-sm text-gray-600">
                  Modelos 3D detalhados que tornam os tesouros mais realistas e envolventes
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎮</div>
                <h3 className="font-medium text-gray-800 mb-1">Interatividade</h3>
                <p className="text-sm text-gray-600">
                  Rotação, zoom e interação touch para explorar cada ângulo dos tesouros
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌟</div>
                <h3 className="font-medium text-gray-800 mb-1">Engajamento</h3>
                <p className="text-sm text-gray-600">
                  Experiência imersiva que aumenta o tempo de jogo e a satisfação do usuário
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Otimizações de Performance */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ⚡ Otimizado para Mobile
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Performance 2025</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Modelos low-poly para dispositivos móveis</li>
                  <li>✓ Texturas otimizadas (potências de 2)</li>
                  <li>✓ Instancing para múltiplos objetos</li>
                  <li>✓ Lazy loading de assets 3D</li>
                  <li>✓ Fallback gracefull para dispositivos antigos</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">PWA Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Cache offline de assets 3D</li>
                  <li>✓ Carregamento rápido (&lt; 3 segundos)</li>
                  <li>✓ Touch controls intuitivos</li>
                  <li>✓ Responsive design completo</li>
                  <li>✓ Install prompt para app nativo</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleBackToMap}
            variant="secondary"
            className="px-6 py-3"
          >
            ← Voltar ao Mapa
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="px-6 py-3"
          >
            🔄 Recarregar Demo
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            className="px-6 py-3"
          >
            🏠 Ir para Home
          </Button>
        </div>

        {/* Footer informativo */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Powered by Three.js • PWA Optimized • Mobile First
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Esta é uma demonstração da futura experiência 3D do Capão do Tesouro
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeDemoPage;