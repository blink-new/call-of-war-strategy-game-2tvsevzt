import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Progress } from './components/ui/progress'
import { ScrollArea } from './components/ui/scroll-area'
import { 
  Plane, 
  Shield, 
  Trophy, 
  Target,
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  Zap,
  Star,
  Award,
  Brain
} from 'lucide-react'

// Aircraft data types
interface Aircraft {
  id: string
  name: string
  category: 'military' | 'commercial'
  type: string
  imageUrl: string
  description: string
  identificationFeatures: string[]
  specifications: {
    wingspan?: string
    length?: string
    maxSpeed?: string
    range?: string
    firstFlight?: string
    role?: string
  }
}

interface QuizQuestion {
  aircraft: Aircraft
  options: string[]
  correctAnswer: string
}

// Aircraft database
const aircraftDatabase: Aircraft[] = [
  // Military Aircraft
  {
    id: 'f22',
    name: 'F-22 Raptor',
    category: 'military',
    type: 'Fighter',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    description: 'The F-22 Raptor is a fifth-generation, single-seat, twin-engine, all-weather stealth tactical fighter aircraft.',
    identificationFeatures: [
      'Diamond-shaped wings with angular edges',
      'Twin vertical tails canted outward',
      'Rectangular air intakes under the fuselage',
      'Stealth coating gives matte finish',
      'No external weapons pylons'
    ],
    specifications: {
      wingspan: '13.56 m',
      length: '18.90 m',
      maxSpeed: 'Mach 2.25',
      range: '2,960 km',
      firstFlight: '1997',
      role: 'Air superiority fighter'
    }
  },
  {
    id: 'a10',
    name: 'A-10 Thunderbolt II',
    category: 'military',
    type: 'Attack Aircraft',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    description: 'The A-10 Thunderbolt II is a single-seat, twin-engine, straight-wing jet aircraft designed for close air support.',
    identificationFeatures: [
      'Straight, unswept wings mounted high on fuselage',
      'Twin engines mounted above rear fuselage',
      'Large, prominent nose-mounted 30mm cannon',
      'Distinctive "bathtub" titanium cockpit',
      'Multiple external hardpoints for weapons'
    ],
    specifications: {
      wingspan: '17.53 m',
      length: '16.26 m',
      maxSpeed: '706 km/h',
      range: '4,150 km',
      firstFlight: '1972',
      role: 'Close air support'
    }
  },
  {
    id: 'b2',
    name: 'B-2 Spirit',
    category: 'military',
    type: 'Bomber',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    description: 'The B-2 Spirit is a multi-role stealth bomber capable of deploying both conventional and nuclear weapons.',
    identificationFeatures: [
      'Flying wing design with no vertical tail',
      'Distinctive sawtooth trailing edge',
      'Dark gray stealth coating',
      'Four engines embedded in the wing',
      'Triangular exhaust nozzles'
    ],
    specifications: {
      wingspan: '52.4 m',
      length: '21.0 m',
      maxSpeed: 'Mach 0.95',
      range: '11,100 km',
      firstFlight: '1989',
      role: 'Strategic stealth bomber'
    }
  },
  // Commercial Aircraft
  {
    id: 'boeing747',
    name: 'Boeing 747',
    category: 'commercial',
    type: 'Wide-body Airliner',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    description: 'The Boeing 747 is a large, long-range wide-body airliner and cargo aircraft, often referred to as the "Queen of the Skies".',
    identificationFeatures: [
      'Distinctive upper deck "hump" behind cockpit',
      'Four engines mounted under swept wings',
      'Very large size compared to other aircraft',
      'Prominent nose gear with multiple wheels',
      'High wing position relative to fuselage'
    ],
    specifications: {
      wingspan: '64.4 m',
      length: '70.6 m',
      maxSpeed: '988 km/h',
      range: '14,200 km',
      firstFlight: '1969',
      role: 'Long-haul passenger/cargo transport'
    }
  },
  {
    id: 'a380',
    name: 'Airbus A380',
    category: 'commercial',
    type: 'Wide-body Airliner',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    description: 'The Airbus A380 is the world\'s largest passenger airliner, a wide-body aircraft with a full-length double deck.',
    identificationFeatures: [
      'Full-length double deck throughout entire fuselage',
      'Four engines with very large fan diameter',
      'Massive size - largest passenger aircraft',
      'Distinctive curved upper deck windows',
      'Very wide fuselage cross-section'
    ],
    specifications: {
      wingspan: '79.8 m',
      length: '72.7 m',
      maxSpeed: '945 km/h',
      range: '15,200 km',
      firstFlight: '2005',
      role: 'Ultra-long-haul passenger transport'
    }
  },
  {
    id: 'boeing737',
    name: 'Boeing 737',
    category: 'commercial',
    type: 'Narrow-body Airliner',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    description: 'The Boeing 737 is a narrow-body aircraft and one of the most popular commercial airliners in the world.',
    identificationFeatures: [
      'Low-mounted wings close to ground',
      'Two engines mounted under wings',
      'Relatively small, narrow fuselage',
      'Pointed nose with small cockpit windows',
      'Simple, straight wing design'
    ],
    specifications: {
      wingspan: '35.8 m',
      length: '39.5 m',
      maxSpeed: '876 km/h',
      range: '6,570 km',
      firstFlight: '1967',
      role: 'Short to medium-haul passenger transport'
    }
  }
]

function App() {
  const [activeTab, setActiveTab] = useState<'military' | 'commercial'>('military')
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [streak, setStreak] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  // Generate a new question
  const generateQuestion = (category: 'military' | 'commercial') => {
    const categoryAircraft = aircraftDatabase.filter(a => a.category === category)
    const correctAircraft = categoryAircraft[Math.floor(Math.random() * categoryAircraft.length)]
    
    // Generate wrong options from the same category
    const wrongOptions = categoryAircraft
      .filter(a => a.id !== correctAircraft.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(a => a.name)
    
    const allOptions = [correctAircraft.name, ...wrongOptions].sort(() => 0.5 - Math.random())
    
    const question: QuizQuestion = {
      aircraft: correctAircraft,
      options: allOptions,
      correctAnswer: correctAircraft.name
    }
    
    setCurrentQuestion(question)
    setSelectedAnswer('')
    setShowResult(false)
    setShowExplanation(false)
  }

  // Handle answer submission
  const submitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return
    
    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }))
    
    if (correct) {
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }
  }

  // Start new question
  const nextQuestion = () => {
    generateQuestion(activeTab)
  }

  // Reset quiz
  const resetQuiz = () => {
    setScore({ correct: 0, total: 0 })
    setStreak(0)
    generateQuestion(activeTab)
  }

  // Initialize with first question
  useEffect(() => {
    generateQuestion(activeTab)
  }, [activeTab])

  const accuracyRate = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Aircraft Identification Quiz</h1>
                <p className="text-slate-300">Test your knowledge of military and commercial aircraft</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{score.correct}/{score.total}</div>
                <div className="text-sm text-slate-300">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{accuracyRate}%</div>
                <div className="text-sm text-slate-300">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{streak}</div>
                <div className="text-sm text-slate-300">Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'military' | 'commercial')}>
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800 border-slate-700">
            <TabsTrigger value="military" className="flex items-center space-x-2 data-[state=active]:bg-red-600">
              <Shield className="w-4 h-4" />
              <span>Military Aircraft</span>
            </TabsTrigger>
            <TabsTrigger value="commercial" className="flex items-center space-x-2 data-[state=active]:bg-blue-600">
              <Plane className="w-4 h-4" />
              <span>Commercial Aircraft</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-8">
            {currentQuestion && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Quiz Card */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                      <span>Identify this Aircraft</span>
                      <Badge variant={activeTab === 'military' ? 'destructive' : 'default'}>
                        {activeTab === 'military' ? 'Military' : 'Commercial'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Aircraft Image */}
                    <div className="relative aspect-video bg-slate-700 rounded-lg overflow-hidden">
                      <img
                        src={currentQuestion.aircraft.imageUrl}
                        alt="Aircraft to identify"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white">Which aircraft is this?</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {currentQuestion.options.map((option, index) => (
                          <Button
                            key={index}
                            variant={selectedAnswer === option ? "default" : "outline"}
                            className={`justify-start h-12 ${
                              selectedAnswer === option 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                            }`}
                            onClick={() => setSelectedAnswer(option)}
                            disabled={showResult}
                          >
                            <Target className="w-4 h-4 mr-2" />
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Submit/Result Section */}
                    <div className="space-y-4">
                      {!showResult ? (
                        <Button
                          onClick={submitAnswer}
                          disabled={!selectedAnswer}
                          className="w-full h-12 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submit Answer
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          {/* Result Display */}
                          <div className={`p-4 rounded-lg border ${
                            isCorrect 
                              ? 'bg-green-900/30 border-green-600 text-green-100' 
                              : 'bg-red-900/30 border-red-600 text-red-100'
                          }`}>
                            <div className="flex items-center space-x-2">
                              {isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                              )}
                              <span className="font-semibold">
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                              </span>
                            </div>
                            <p className="mt-2">
                              The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-3">
                            <Button
                              onClick={nextQuestion}
                              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Next Question
                            </Button>
                            <Button
                              onClick={() => setShowExplanation(!showExplanation)}
                              variant="outline"
                              className="h-12 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Learn More
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Information Panel */}
                <div className="space-y-6">
                  {/* Stats Panel */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                        Your Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{score.correct}</div>
                          <div className="text-xs text-slate-400">Correct</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-300">{score.total}</div>
                          <div className="text-xs text-slate-400">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-400">{streak}</div>
                          <div className="text-xs text-slate-400">Streak</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Accuracy Rate</span>
                          <span className="text-white font-medium">{accuracyRate}%</span>
                        </div>
                        <Progress value={accuracyRate} className="h-2" />
                      </div>

                      <Button
                        onClick={resetQuiz}
                        variant="outline"
                        className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Quiz
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Aircraft Details (shown after answer) */}
                  {showResult && showExplanation && currentQuestion && (
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <Brain className="w-5 h-5 mr-2 text-purple-400" />
                          Aircraft Details: {currentQuestion.aircraft.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {currentQuestion.aircraft.description}
                        </p>

                        <div>
                          <h4 className="text-white font-semibold mb-2">Key Identification Features:</h4>
                          <ul className="space-y-1">
                            {currentQuestion.aircraft.identificationFeatures.map((feature, index) => (
                              <li key={index} className="text-slate-300 text-sm flex items-start">
                                <Star className="w-3 h-3 mr-2 mt-1 text-yellow-400 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-600">
                          <div>
                            <h5 className="text-white font-medium text-sm">Specifications</h5>
                            <div className="space-y-1 mt-2">
                              {Object.entries(currentQuestion.aircraft.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                  <span className="text-slate-300">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-center">
                            <Badge 
                              variant={currentQuestion.aircraft.category === 'military' ? 'destructive' : 'default'}
                              className="mb-2"
                            >
                              {currentQuestion.aircraft.type}
                            </Badge>
                            <div className="text-xs text-slate-400">
                              {currentQuestion.aircraft.category === 'military' ? 'Military' : 'Commercial'} Aircraft
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App