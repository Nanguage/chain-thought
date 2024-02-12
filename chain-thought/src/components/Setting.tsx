import { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { DialogTitle, DialogContent } from '@mui/material';
import TextField from '@mui/material/TextField';
import SettingsIcon from '@mui/icons-material/Settings';
import Checkbox from '@mui/material/Checkbox';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';

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
              <label id="apiBase-label" className='text-gray-500 text-sm'>
                API Base URL
              </label>
              <TextField
                id="apiBase"
                value="https://api.openai.com/v1"
                className='w-full'
                ></TextField>
            </div>
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
              <Autocomplete
                id="model"
                value={model}
                onChange={(e, value) => {
                  if (value === null) return;
                  setModel(value)
                }}
                options={models}
                className='w-full'
                renderInput={(params) => <TextField {...params} />}
                />
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
        <DialogActions>
          <Button size="large" onClick={() => setIsOpen(false)}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Setting;
