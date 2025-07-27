import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  CheckCircle, 
  ArrowRight, 
  Lightbulb, 
  Target,
  Zap
} from "lucide-react";

const AIQuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What type of problem-solving excites you most?",
      options: [
        "Building user-friendly applications",
        "Protecting systems from cyber threats",
        "Analyzing data to find patterns",
        "Creating intelligent automated systems"
      ]
    },
    {
      id: 2,
      question: "Which work environment appeals to you?",
      options: [
        "Collaborative development teams",
        "Security operations centers",
        "Research and analytics labs",
        "Innovation and R&D departments"
      ]
    },
    {
      id: 3,
      question: "What's your preferred learning style?",
      options: [
        "Hands-on coding projects",
        "Security simulations and challenges",
        "Data analysis and visualization",
        "AI model experimentation"
      ]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const getRecommendedPath = () => {
    // Simple recommendation logic based on answers
    const answerCounts = answers.reduce((acc, answer) => {
      const index = questions.find(q => q.options.includes(answer))?.options.indexOf(answer) || 0;
      acc[index] = (acc[index] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const maxIndex = Object.keys(answerCounts).reduce((a, b) => 
      answerCounts[parseInt(a)] > answerCounts[parseInt(b)] ? a : b
    );

    const paths = [
      "Software Engineer",
      "Cybersecurity Specialist", 
      "Data Scientist",
      "AI/ML Engineer"
    ];

    return paths[parseInt(maxIndex)];
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <section id="quiz" className="py-20 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-6">
            <Brain className="w-4 h-4 text-accent animate-glow" />
            <span className="text-sm font-medium">AI-Powered Assessment</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your <span className="gradient-text">Perfect Match</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Take our AI-powered quiz to receive personalized career recommendations 
            based on your interests, skills, and aspirations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!showResults ? (
            <Card className="glass-card p-8 md:p-12">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Question {currentQuestion + 1} of {questions.length}</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question */}
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {questions[currentQuestion].question}
                  </h3>
                  <p className="text-muted-foreground">Choose the option that best describes you</p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="glass"
                      className="h-auto p-6 text-left justify-start hover:scale-105 transition-all duration-300 group"
                      onClick={() => handleAnswer(option)}
                    >
                      <div className="flex items-start space-x-4 w-full">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 group-hover:animate-glow">
                          <span className="text-white font-bold text-sm">{String.fromCharCode(65 + index)}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{option}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="glass-card p-8 md:p-12 text-center">
              <div className="space-y-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto animate-glow">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Your Perfect Career Match!
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Based on your responses, we recommend:
                  </p>
                </div>

                <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Target className="w-8 h-8 text-primary" />
                    <h4 className="text-2xl font-bold gradient-text">{getRecommendedPath()}</h4>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    This career path aligns perfectly with your interests and goals. 
                    You'll find engaging challenges and excellent growth opportunities.
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-green-400">
                    <Zap className="w-4 h-4" />
                    <span>94% compatibility match</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Button variant="hero" size="lg" className="group">
                    View Learning Path
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="glass" size="lg" onClick={resetQuiz}>
                    Retake Quiz
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: Brain,
              title: "AI-Powered Analysis",
              description: "Advanced algorithms analyze your responses for accurate recommendations"
            },
            {
              icon: Target,
              title: "Personalized Results",
              description: "Get career suggestions tailored to your unique profile and goals"
            },
            {
              icon: Zap,
              title: "Instant Insights",
              description: "Receive immediate feedback and actionable next steps"
            }
          ].map((feature, index) => (
            <Card key={feature.title} className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:animate-glow">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIQuizSection;