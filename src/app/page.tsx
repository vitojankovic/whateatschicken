'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// Assuming you have the JSON data in a file named animals.json in the same directory
import animalData from './animals.json'

export default function Home() {
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
      const nextAnimal = animalData.find(animal => animal.name === predator)
      if (nextAnimal) {
        setCurrentAnimal(nextAnimal)
      } else {
        // Fallback to random animal if predator is not in the list
        setCurrentAnimal(animalData[Math.floor(Math.random() * animalData.length)])
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
    setCurrentAnimal(animalData[Math.floor(Math.random() * animalData.length)])
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Animal Predator Game</CardTitle>
          <CardDescription>
            Type a predator of the given animal. Score: {score}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gameOver ? (
            <div className="text-center">
              <p className="mb-4">Game Over! Your final score: {score}</p>
              <Button onClick={restartGame}>Restart Game</Button>
            </div>
          ) : (
            <>
              <p className="mb-2">Current animal: <strong>{currentAnimal.name}</strong></p>
              <p className="mb-4 text-sm">{currentAnimal.description}</p>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Type a predator..."
                  value={input}
                  onChange={handleInputChange}
                  ref={inputRef}
                />
                {input && (
                  <ScrollArea className="absolute z-10 w-full max-h-[200px] bg-white border rounded-md shadow-lg">
                    {filteredAnimals.map((animal, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start"
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
        <CardFooter className="text-sm text-center">
          Share your high score on Twitter! @YourTwitterHandle
        </CardFooter>
      </Card>
    </div>
  )
}