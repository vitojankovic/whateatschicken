'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// Assuming you have the JSON data in a file named animals.json in the same directory
import animalData from './animals.json'

export default function Home() {

  const [youGuessed, setYouGuessed] = useState<string[]>([])

  const [currentAnimal, setCurrentAnimal] = useState(animalData[0])
  const [score, setScore] = useState(0)
  const [input, setInput] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [filteredAnimals, setFilteredAnimals] = useState(animalData.map(animal => animal.name))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCurrentAnimal(animalData[Math.floor(Math.random() * animalData.length)])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    setFilteredAnimals(
      animalData
        .map(animal => animal.name)
        .filter(name => name.toLowerCase().includes(e.target.value.toLowerCase()))
    )
  }

  const handleSubmit = (predator: string) => {
    if (currentAnimal.predators.includes(predator)) {
      console.log(predator)
      setScore(score + 10)
      setYouGuessed(prevGuessed => [...prevGuessed, predator])
      const nextAnimal = animalData.find(animal => animal.name === predator)
      if (nextAnimal) {
        setCurrentAnimal(nextAnimal)
      } else {
        const selectedAnimals = animalData.filter(animal => animal.predators.length > 0)
        setCurrentAnimal(selectedAnimals[Math.floor(Math.random() * selectedAnimals.length)])
      }
      setInput('')
      inputRef.current?.focus()
    } else {
      setGameOver(true)
    }
  }

  const restartGame = () => {
    setScore(0)
    setGameOver(false)
    const selectedAnimals = animalData.filter(animal => animal.predators.length > 0)
    setCurrentAnimal(selectedAnimals[Math.floor(Math.random() * selectedAnimals.length)])
    setInput('')
    setYouGuessed([])
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <Card className="w-[500px] p-6 bg-transparent rounded-xl border-none outline-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold">Animal Predator Game</CardTitle>
          <CardDescription className="text-lg text-center">
            Type a predator of the given animal. Score: {score}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {gameOver ? (
            <div>
              <p className="mb-4 text-2xl font-semibold">Game Over! Your final score: {score}</p>
              <Button className="text-lg px-6 py-3" onClick={restartGame}>Restart Game</Button>
            </div>
          ) : (
            <>
              <div className="text-9xl mb-6">{currentAnimal.emoji}</div>
              <p className="mb-4 text-2xl font-semibold">
                Current animal: <strong>{currentAnimal.name}</strong>
              </p>
              <p className="mb-6 text-md text-gray-600">{currentAnimal.description}</p>
              <div className="relative">
                <Input
                  className="text-lg px-4 py-3"
                  type="text"
                  placeholder="Type a predator..."
                  value={input}
                  onChange={handleInputChange}
                  ref={inputRef}
                />
                <h2>
                  You guessed: {youGuessed.join(', ')}
                </h2>
                {input && (
                  <ScrollArea className="absolute z-10 w-full max-h-[200px] bg-white border rounded-md shadow-lg mt-2">
                    {filteredAnimals.map((animal, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-lg"
                        onClick={() => handleSubmit(animal)}
                      >
                        {animal}
                      </Button>
                    ))}
                  </ScrollArea>
                )}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="text-md text-center mt-4">
          Share your high score on Twitter! @softwaretgthr
        </CardFooter>
      </Card>
    </div>
  )
}
