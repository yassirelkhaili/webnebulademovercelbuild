import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import skillsContent from "../constants/skills"
import { skillsTitle } from "../constants/skills"
import { Content } from "../constants/skills"

const Skills = () => {
return (
    <section className="min-h-screen mt-4 flex flex-col items-center"> 
    <div>
    <h1 id="Skills" className="text-3xl font-lato dark:text-slate-50 text-dark p-3 border-b-[3px] border-b-logo-100 dark:border-b-logo-900 w-fit">{skillsTitle}</h1>
    </div>
    <div className="grid grid-cols-4 gap-4 container">
    {skillsContent.map((item : Content)=> (
        <Card className="mt-8"> 
        <CardContent className="flex flex-col gap-2 pt-[1.5rem]">{item.title}</CardContent> 
        <CardFooter className="flex flex-col items-start gap-2">{item.img}</CardFooter> 
        </Card> 
    ))}
    </div>
    </section>
)
}

export default Skills