import { Configuration, OpenAIApi } from 'openai';
import { Message } from '../types/message';


const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // 请在 .env 文件中设置你的API密钥，例如：REACT_APP_OPENAI_API_KEY=your_api_key_here
});
const openai = new OpenAIApi(configuration);


const convertSenderToRole = (sender: 'user' | 'bot'): 'user' | 'assistant' => {
  return sender === 'bot' ? 'assistant' : 'user';
};


export const sendMessage = async (messages: Message[]): Promise<string> => {
  try {
    // 将现有消息转换为 ChatGPT API 格式
    const formattedMessages = messages.map((msg) => ({
      role: convertSenderToRole(msg.sender),
      content: msg.content,
    }));
    console.log(formattedMessages)

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
