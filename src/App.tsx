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
  category: 'fighter' | 'bomber' | 'transport'
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
    armament?: string
    engine?: string
  }
  nation: string
}

interface QuizQuestion {
  aircraft: Aircraft
  options: string[]
  correctAnswer: string
}

// WWII Aircraft database - Historical aircraft from Call of War era
const aircraftDatabase: Aircraft[] = [
  // Fighter Aircraft
  {
    id: 'spitfire',
    name: 'Supermarine Spitfire',
    category: 'fighter',
    type: 'Fighter',
    imageUrl: 'https://images.unsplash.com/photo-1635347395277-081ccb430dec?w=800',
    description: 'The Supermarine Spitfire was a British single-seat fighter aircraft used by the Royal Air Force and many other Allied countries throughout World War II.',
    identificationFeatures: [
      'Distinctive elliptical wing shape',
      'Merlin engine with characteristic exhaust stacks',
      'Retractable landing gear',
      'Single-seat cockpit with bubble canopy',
      'RAF roundel markings'
    ],
    specifications: {
      wingspan: '11.23 m',
      length: '9.12 m',
      maxSpeed: '594 km/h',
      range: '1,827 km',
      firstFlight: '1936',
      role: 'Interceptor fighter',
      armament: '8× .303 machine guns',
      engine: 'Rolls-Royce Merlin V-12'
    },
    nation: 'United Kingdom'
  },
  {
    id: 'p51mustang',
    name: 'P-51 Mustang',
    category: 'fighter',
    type: 'Fighter',
    imageUrl: 'https://images.unsplash.com/photo-1681999935315-f0b9886c36ec?w=800',
    description: 'The North American P-51 Mustang was an American long-range fighter that played a crucial role in the European air war.',
    identificationFeatures: [
      'Laminar flow wing design',
      'Distinctive air intake under fuselage',
      'Four-blade propeller',
      'Bubble canopy for excellent visibility',
      'USAAF star-and-bar markings'
    ],
    specifications: {
      wingspan: '11.28 m',
      length: '9.83 m',
      maxSpeed: '703 km/h',
      range: '2,755 km',
      firstFlight: '1940',
      role: 'Long-range escort fighter',
      armament: '6× .50 cal machine guns',
      engine: 'Packard V-1650 Merlin'
    },
    nation: 'United States'
  },
  {
    id: 'bf109',
    name: 'Messerschmitt Bf 109',
    category: 'fighter',
    type: 'Fighter',
    imageUrl: 'https://images.unsplash.com/photo-1698655180498-1abb92536648?w=800',
    description: 'The Messerschmitt Bf 109 was a German World War II fighter aircraft and one of the first true modern fighters of the era.',
    identificationFeatures: [
      'Angular, narrow fuselage design',
      'Single main landing gear leg per side',
      'Distinctive nose-mounted cannon',
      'Small cockpit with limited visibility',
      'Luftwaffe cross markings'
    ],
    specifications: {
      wingspan: '9.87 m',
      length: '8.95 m',
      maxSpeed: '640 km/h',
      range: '850 km',
      firstFlight: '1935',
      role: 'Interceptor fighter',
      armament: '1× 20mm cannon, 2× 7.92mm MGs',
      engine: 'Daimler-Benz DB 605'
    },
    nation: 'Germany'
  },
  {
    id: 'zero',
    name: 'Mitsubishi A6M Zero',
    category: 'fighter',
    type: 'Fighter',
    imageUrl: 'https://images.unsplash.com/photo-1628996796690-8e3d9342668e?w=800',
    description: 'The Mitsubishi A6M "Zero" was a long-range fighter aircraft operated by the Imperial Japanese Navy Air Service.',
    identificationFeatures: [
      'Very long range capabilities',
      'Lightweight construction',
      'Fixed landing gear on early models',
      'Hinomaru (rising sun) markings',
      'Extremely maneuverable design'
    ],
    specifications: {
      wingspan: '12.0 m',
      length: '9.06 m',
      maxSpeed: '533 km/h',
      range: '3,104 km',
      firstFlight: '1939',
      role: 'Carrier-based fighter',
      armament: '2× 20mm cannons, 2× 7.7mm MGs',
      engine: 'Nakajima NK1C Sakae'
    },
    nation: 'Japan'
  },
  // Bomber Aircraft
  {
    id: 'b17',
    name: 'B-17 Flying Fortress',
    category: 'bomber',
    type: 'Heavy Bomber',
    imageUrl: 'https://images.unsplash.com/photo-1732445486279-8c6e9b676388?w=800',
    description: 'The Boeing B-17 Flying Fortress was an American four-engine heavy bomber used in strategic bombing campaigns.',
    identificationFeatures: [
      'Four radial engines on high wings',
      'Distinctive glass nose section',
      'Multiple gun turrets for defense',
      'Large bomb bay in center fuselage',
      'Twin vertical tail fins'
    ],
    specifications: {
      wingspan: '31.6 m',
      length: '22.8 m',
      maxSpeed: '462 km/h',
      range: '3,200 km',
      firstFlight: '1935',
      role: 'Strategic heavy bomber',
      armament: '13× .50 cal machine guns',
      engine: '4× Wright R-1820 Cyclone'
    },
    nation: 'United States'
  },
  {
    id: 'he111',
    name: 'Heinkel He 111',
    category: 'bomber',
    type: 'Medium Bomber',
    imageUrl: 'https://images.unsplash.com/photo-1709873582549-79defeb51271?w=800',
    description: 'The Heinkel He 111 was a German bomber aircraft designed ostensibly as a transport aircraft but primarily used as a medium bomber.',
    identificationFeatures: [
      'Twin-engine design with glazed nose',
      'Distinctive greenhouse-style cockpit',
      'Elliptical wing planform',
      'Stepped cockpit profile',
      'German Balkenkreuz markings'
    ],
    specifications: {
      wingspan: '22.6 m',
      length: '16.4 m',
      maxSpeed: '435 km/h',
      range: '2,300 km',
      firstFlight: '1935',
      role: 'Medium bomber',
      armament: '7× 7.92mm machine guns',
      engine: '2× Junkers Jumo 211'
    },
    nation: 'Germany'
  },
  // Transport Aircraft
  {
    id: 'c47',
    name: 'Douglas C-47 Skytrain',
    category: 'transport',
    type: 'Transport',
    imageUrl: 'https://images.unsplash.com/photo-1616266138330-7b2f3a6d5818?w=800',
    description: 'The Douglas C-47 Skytrain was a transport aircraft that served with distinction in World War II in the European, Pacific, and China-Burma-India theaters.',
    identificationFeatures: [
      'Twin-engine monoplane design',
      'Fixed tricycle landing gear',
      'Large cargo doors on fuselage side',
      'Metal construction with riveted skin',
      'Distinctive engine nacelles'
    ],
    specifications: {
      wingspan: '28.96 m',
      length: '19.66 m',
      maxSpeed: '360 km/h',
      range: '2,414 km',
      firstFlight: '1935',
      role: 'Military transport',
      armament: 'None (transport role)',
      engine: '2× Pratt & Whitney R-1830'
    },
    nation: 'United States'
  },
  {
    id: 'ju52',
    name: 'Junkers Ju 52',
    category: 'transport',
    type: 'Transport',
    imageUrl: 'https://images.unsplash.com/photo-1651119295972-b4f733e69713?w=800',
    description: 'The Junkers Ju 52 was a German transport aircraft that served as both a civilian airliner and military transport.',
    identificationFeatures: [
      'Tri-motor configuration',
      'Corrugated metal construction',
      'Fixed landing gear with spats',
      'High-wing monoplane design',
      'Distinctive boxy fuselage shape'
    ],
    specifications: {
      wingspan: '29.25 m',
      length: '18.90 m',
      maxSpeed: '290 km/h',
      range: '1,305 km',
      firstFlight: '1930',
      role: 'Transport and paratrooper carrier',
      armament: '1× 7.92mm machine gun',
      engine: '3× BMW 132 radial'
    },
    nation: 'Germany'
  }
]

function App() {
  const [activeTab, setActiveTab] = useState<'fighter' | 'bomber' | 'transport'>('fighter')
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [streak, setStreak] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  // Generate a new question
  const generateQuestion = (category: 'fighter' | 'bomber' | 'transport') => {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fighter': return 'bg-red-600'
      case 'bomber': return 'bg-orange-600'
      case 'transport': return 'bg-blue-600'
      default: return 'bg-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fighter': return <Target className="w-4 h-4" />
      case 'bomber': return <Plane className="w-4 h-4" />
      case 'transport': return <Shield className="w-4 h-4" />
      default: return <Plane className="w-4 h-4" />
    }
  }

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
                <h1 className="text-3xl font-bold text-white">Call of War - Aircraft Recognition</h1>
                <p className="text-slate-300">Master the aircraft of World War II</p>
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
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'fighter' | 'bomber' | 'transport')}>
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-800 border-slate-700">
            <TabsTrigger value="fighter" className="flex items-center space-x-2 data-[state=active]:bg-red-600">
              <Target className="w-4 h-4" />
              <span>Fighters</span>
            </TabsTrigger>
            <TabsTrigger value="bomber" className="flex items-center space-x-2 data-[state=active]:bg-orange-600">
              <Plane className="w-4 h-4" />
              <span>Bombers</span>
            </TabsTrigger>
            <TabsTrigger value="transport" className="flex items-center space-x-2 data-[state=active]:bg-blue-600">
              <Shield className="w-4 h-4" />
              <span>Transport</span>
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
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getCategoryColor(activeTab)} text-white`}>
                          {getCategoryIcon(activeTab)}
                          <span className="ml-1 capitalize">{activeTab}</span>
                        </Badge>
                        <Badge variant="outline" className="text-white border-slate-600">
                          {currentQuestion.aircraft.nation}
                        </Badge>
                      </div>
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
                      <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
                        WWII Era - {currentQuestion.aircraft.specifications.firstFlight}
                      </div>
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
                                ? `${getCategoryColor(activeTab)} hover:opacity-90 text-white` 
                                : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                            }`}
                            onClick={() => setSelectedAnswer(option)}
                            disabled={showResult}
                          >
                            {getCategoryIcon(activeTab)}
                            <span className="ml-2">{option}</span>
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
                                {isCorrect ? 'Excellent!' : 'Not quite right'}
                              </span>
                            </div>
                            <p className="mt-2">
                              The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                            </p>
                            <p className="text-sm mt-1 opacity-90">
                              A {currentQuestion.aircraft.nation} {currentQuestion.aircraft.type.toLowerCase()} from {currentQuestion.aircraft.specifications.firstFlight}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-3">
                            <Button
                              onClick={nextQuestion}
                              className={`flex-1 h-12 ${getCategoryColor(activeTab)} hover:opacity-90`}
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Next Aircraft
                            </Button>
                            <Button
                              onClick={() => setShowExplanation(!showExplanation)}
                              variant="outline"
                              className="h-12 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Details
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
                        Mission Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{score.correct}</div>
                          <div className="text-xs text-slate-400">Identified</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-300">{score.total}</div>
                          <div className="text-xs text-slate-400">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-400">{streak}</div>
                          <div className="text-xs text-slate-400">Best Streak</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Recognition Rate</span>
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
                        Reset Mission
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Aircraft Intelligence (shown after answer) */}
                  {showResult && showExplanation && currentQuestion && (
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <Brain className="w-5 h-5 mr-2 text-purple-400" />
                          Aircraft Intelligence: {currentQuestion.aircraft.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {currentQuestion.aircraft.description}
                        </p>

                        <div>
                          <h4 className="text-white font-semibold mb-2 flex items-center">
                            <Target className="w-4 h-4 mr-2 text-yellow-400" />
                            Key Recognition Features:
                          </h4>
                          <ul className="space-y-1">
                            {currentQuestion.aircraft.identificationFeatures.map((feature, index) => (
                              <li key={index} className="text-slate-300 text-sm flex items-start">
                                <Star className="w-3 h-3 mr-2 mt-1 text-yellow-400 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-600">
                          <div>
                            <h5 className="text-white font-medium text-sm mb-2">Combat Specifications</h5>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              {Object.entries(currentQuestion.aircraft.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                  <span className="text-slate-300 font-mono">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Badge 
                            className={`${getCategoryColor(currentQuestion.aircraft.category)} text-white`}
                          >
                            {getCategoryIcon(currentQuestion.aircraft.category)}
                            <span className="ml-1">{currentQuestion.aircraft.type}</span>
                          </Badge>
                          <div className="text-xs text-slate-400">
                            Nation: <span className="text-slate-300 font-medium">{currentQuestion.aircraft.nation}</span>
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