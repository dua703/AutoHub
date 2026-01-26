'use client'

 import { useEffect, useState } from 'react'
 import Image from 'next/image'

 interface LoadingScreenProps {
   message?: string
 }

 export default function LoadingScreen({ message = 'Loading AutoHub…' }: LoadingScreenProps) {
   const [progress, setProgress] = useState(0)
   const [mounted, setMounted] = useState(false)

   useEffect(() => {
     setMounted(true)
     let current = 0
     const interval = setInterval(() => {
       current += Math.floor(Math.random() * 8) + 3
       if (current >= 100) {
         current = 100
         clearInterval(interval)
       }
       setProgress(current)
     }, 200)

     return () => {
       clearInterval(interval)
     }
   }, [])

   return (
     <div className="min-h-screen w-full flex items-center justify-center bg-background">
       <div
         className={`flex flex-col items-center gap-4 transition-opacity duration-500 ${
           mounted ? 'opacity-100' : 'opacity-0'
         }`}
       >
         <div className="relative">
           <Image
             src="/logo.png"
             alt="AutoHub Logo"
             width={180}
             height={60}
             className="h-12 w-auto sm:h-14 object-contain animate-pulse"
             priority
           />
         </div>
         <div className="flex flex-col items-center gap-2">
           <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
           <p className="text-sm sm:text-base text-muted-foreground">{message}</p>
           <p className="text-xs text-muted-foreground">{progress}%</p>
         </div>
       </div>
     </div>
   )
 }
