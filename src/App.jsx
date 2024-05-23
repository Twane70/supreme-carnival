import { Input } from "@/components/ui/input"

export default function App() {
  return (
    <div
  className="inset-0 absolute flex flex-col items-center justify-center gap-4 h-full w-full bg-background bg-[linear-gradient(to_right,rgb(220,220,220)_1px,transparent_1px),linear-gradient(to_bottom,rgb(220,220,220)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,0,0,0.6)_60%,transparent_130%)]"
>
  <span className='text-2xl text-primary font-semibold'>Explorer un sujet :</span>
  <Input placeholder="Pourquoi le ciel est bleu ?" className='w-min-[200px] w-[600px] rounded-full bg-secondary/50 m-1 p-6 text-xl drop-shadow-md focus-visible:drop-shadow-lg focus-visible:bg-secondary transition ease-in-out' />
</div>
  )
}