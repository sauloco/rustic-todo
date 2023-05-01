import {NextApiRequest, NextApiResponse} from 'next';
import {ChatGPTAPI} from 'chatgpt';
import {v4} from 'uuid';

const api = new ChatGPTAPI({
	apiKey: process.env.OPENAI_API_KEY || '',
	completionParams: {
		temperature: 0.5,
		top_p: 0.8
	}
})

const systemMessage = `
Act as a personal assistant.
I will tell you a task I need to do, you will only return a minimal and concise list of one, two, three or four subtasks to accomplish the given task with the suggested time reference for when the subtask must be performed, if the task is simple enough simply return it as is.

---
Example 1
buy milk tomorrow. Current date: 2023/04/29
Returns: 
2023/04/30 | Buy milk.
---
Example 2
Prompt: cook diner tomorrow. Current date: 2023/04/29 
Returns: 
2023/04/29 9:00 | Check fridge and pantry for all the ingredients. 
2023/04/29 16:00 | Go to grocery store or market for any ingredient.
2023/04/29 18:00 | Cook dinner.
---
Example 3
Prompt: prepare for Maths exam on next friday. Description: alan has the notes. Current date: 2023/05/01
Returns:
2023/05/02 | Ask Alan for Mathematics notes.
2023/05/03 | Study Mathematics for 2 hours.
2023/05/04 | Study Mathematics for 2 hours.
2023/05/05 | Present for Mathematics exam.
---
`

interface AssistantQuery {
	prompt: string,
	description?: string,
}

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse
) {
	const {prompt, description} = _req.query;

	if (!prompt || typeof prompt !== 'string') {
		res.status(400).json({message: 'prompt must be string and is mandatory.'})
		return;
	}
	if (description && typeof description !== 'string') {
		res.status(400).json({message: 'description must be string.'})
		return;
	}

	const now = new Date().toISOString();
	const enhancedPrompt = `${decodeURI(prompt)}. ${description ? `Description: ${decodeURI(description)}. ` : ''}Current date: ${now}`
	try {

		let chatRes = await api.sendMessage(enhancedPrompt, {systemMessage})
		const items: Item[] = []
		for (const line of chatRes.text.split('\n')) {
			if (line.includes(' | ')) {
				const [date, task] = line.split(' | ');
				const dateCompletion = new Date(date).getTime();
				items.push({
					id: v4(),
					title: task,
					done: false,
					deleted: false,
					dateCompletion,
				})
			}
		}

		res.status(200).json(items);
	} catch (e) {
		console.error(e);
		res.status(503).json({message: `AI Not Available. Retry later.`})
	}
}