import { useState } from "react";
import { MovingLight } from "./login";
import {motion} from "framer-motion"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage(){
    const [name,setName] = useState("")
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      console.log('Login attempted with:', email, password)
    }
    return(

<div className="min-h-screen flex flex-col  items-center justify-center bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <MovingLight />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 text-center mb-8"
      >
        <h1 className="text-5xl font-bold text-white mb-2">InteliBridge</h1>
        <p className="text-xl text-blue-300">AI-Powered Automation Platform</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="z-10 w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-50 p-8 rounded-2xl shadow-lg backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-center text-white mb-6">Signup</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="Name"
                type="Name"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600  rounded-lg hover:bg-blue-700 text-white">
              Signup
            </Button>
          </div>
         
        </form>
      </motion.div>
    </div>




    )




}