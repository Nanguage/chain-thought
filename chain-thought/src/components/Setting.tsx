import { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { DialogTitle, DialogContent } from '@mui/material';
import TextField from '@mui/material/TextField';
import SettingsIcon from '@mui/icons-material/Settings';
import Select from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

import { useSettingStore, useStatusStore } from '../store';
import { models } from '../constants';


const Setting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    apiKey,
    setApiKey,
    model,
    setModel,
    mathJax,
    setMathJax,
  } = useSettingStore((state) => state);
  const { apiKeyError } = useStatusStore((state) => state);
  useEffect(() => {
    if (apiKeyError) {
      setIsOpen(true);
    }
  }, [apiKeyError]);

  return (
    <div className="relative">
      <SettingsIcon
        className=" hover:text-gray-600 hover:cursor-pointer m-2"
        onClick={() => setIsOpen(!isOpen)}
      />
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Settings</DialogTitle>
        <DialogContent>
          <div className='mt-1 flex flex-col gap-2'>
            <div>
              <label id="apiKey-label" className='text-gray-500 text-sm'>
                OpenAI API Key
              </label>
              <label className='text-gray-400 text-sm ml-1'>
                (See help <a className="underline" href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-api-key">here</a>)
              </label>
              <TextField
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                error={apiKeyError}
                className='w-full'
                ></TextField>
            </div>
            <div>
              <label id="model-label" className='text-gray-500 text-sm'>
                Model
              </label>
              <Select
                id="model"
                labelId="model-label"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className='w-full'
                >
                  {
                    models.map((model, idx) => (
                      <MenuItem key={idx} value={model}>{model}</MenuItem>
                    ))
                  }
              </Select>
            </div>
            <div>
              <label id="mathjax-label" className='text-gray-500 text-sm mr-2'>
                MathJax
              </label>
              <Checkbox
                checked={mathJax}
                onChange={(e) => setMathJax(e.target.checked)}
                />
            </div>
          </div>
        </DialogContent>

      </Dialog>
    </div>
  );
};

export default Setting;
