import { Configuration, OpenAIApi } from 'openai';
import { Message } from '../types/message';


const convertSenderToRole = (sender: 'user' | 'bot'): 'user' | 'assistant' => {
  return sender === 'bot' ? 'assistant' : 'user';
};


export const sendMessage = async (messages: Message[], apiKey: string): Promise<string> => {
  const configuration = new Configuration({
    apiKey: apiKey
  });
  const openai = new OpenAIApi(configuration);


  // 将现有消息转换为 ChatGPT API 格式
  const formattedMessages = messages.map((msg) => ({
    role: convertSenderToRole(msg.sender),
    content: msg.content,
  }));

  try {

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: formattedMessages,
    });

    return completion.data.choices[0]?.message?.content ?? 'Error: No response from ChatGPT';
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
