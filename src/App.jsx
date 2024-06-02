import React, { useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Rocket } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const apiUrl = 'https://karlos.onrender.com';

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [topic, setTopic] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [steps, setSteps] = useState({});
  const [loading, setLoading] = useState(false);

  const startProcess = async (event) => {
    event.preventDefault();
    setSteps({});
    setLoading(true);
    try {
      setTopic(inputValue);
      const response = await axios.post(`${apiUrl}/start-process`, { query: inputValue });
      setTaskId(response.data.task_id);
      checkStatus(response.data.task_id);
    } catch (error) {
      console.error('Error starting the process:', error);
      setLoading(false);
    }
  };

  const checkStatus = async (taskId) => {
    try {
      const response = await axios.get(`${apiUrl}/process-status/${taskId}`);
      const statusData = response.data.steps;
      setSteps(statusData);

      if (response.data.status !== 'Terminé' && response.data.status !== 'Échoué') {
        setTimeout(() => checkStatus(taskId), 2000); // Poll every 2 seconds
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking process status:', error);
      setLoading(false);
    }
  };

  const renderSummaryWithHoverCards = (summary, context) => {
    if (!summary || !context) return summary;

    const regex = /\[(\d+)\]/g;
    const parts = summary.split(regex);

    return parts.map((part, index) => {
      if (index % 2 === 0) {
        // Regular text part
        return part;
      } else {
        // Reference part
        const refIndex = parseInt(part, 10);
        const hoverContent = context[refIndex] ? (
          <div className='flex flex-col gap-2'>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={context[refIndex].icon} />
                <AvatarFallback>/</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-left">{context[refIndex].title}</h4>
                {/*<div className="flex items-center pt-2">
                <span className="text-xs text-muted-foreground">
                  {context[refIndex].author}
                </span>
              </div> */}
              </div>
            </div>
            <p className="text-xs bg-gradient-to-b from-primary/90 to-primary/20 inline-block text-transparent bg-clip-text">[...] {context[refIndex].content.slice(0, 240)}</p>
          </div>

        ) : '/';

        return (
          <>
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <Button asChild variant='link' className='pt-0 pb-4 px-1'>
                  <a className='p-0 m-0 h-fit text-secondary-foreground/50 font-semibold' href={context[refIndex]?.source} target="_blank">[{refIndex}]</a>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-96">
                {hoverContent}
              </HoverCardContent>
            </HoverCard>
            <br />
          </>
        );
      }
    });
  };

  return (
    <>
      <div className="inset-0 fixed z-[-1] h-full w-full bg-secondary bg-[linear-gradient(to_right,rgb(200,200,200)_1px,transparent_1px),linear-gradient(to_bottom,rgb(200,200,200)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,0,0,0.6)_60%,transparent_130%)]" />
      <div className="m-4 flex flex-col items-center justify-center gap-4">
        <div className='flex flex-col gap-2 items-center justify-center'>
          <h1 className='text-5xl font-bold text-primary italic tracking-wide'>TrashGPT</h1>
          <span className='text-lg text-secondary-foreground font-medium'>Explorer un sujet :</span>
        </div>
        <form onSubmit={startProcess} className='sticky top-4 z-10 flex flex-row h-12 drop-shadow-md focus-visible:drop-shadow-lg focus-visible:bg-secondary transition ease-in-out'>
          <Input
            placeholder="Pourquoi le ciel est bleu ?"
            className='w-min-[200px] w-[600px] h-full rounded-full rounded-r-none bg-background px-6 text-xl'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" className="h-full rounded-full rounded-l-none px-6" disabled={loading} >
            {loading ? <LoaderCircle className="animate-spin" /> : <Rocket />}
          </Button>
        </form>

        <div className="w-full max-w-4xl mt-4 space-y-4">
          {!loading && steps.summary && (
            <Card className='drop-shadow-md'>
              <CardHeader>
                <CardTitle>{topic} {steps.expert?.emoji}</CardTitle>
                {/* <CardDescription>By {steps.expert?.name}</CardDescription> */}
              </CardHeader>
              <CardContent className='text-justify'>
                {renderSummaryWithHoverCards(steps.summary, steps.context)}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
