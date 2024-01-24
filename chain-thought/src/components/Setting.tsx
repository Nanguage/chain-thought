import { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { DialogTitle, DialogContent } from '@mui/material';
import TextField from '@mui/material/TextField';
import SettingsIcon from '@mui/icons-material/Settings';
import Select from '@mui/material/Select';
import { MenuItem } from '@mui/material';

import { useSettingStore, useStatusStore } from '../store';
import { models } from '../constants';


const Setting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    apiKey,
    setApiKey,
    model,
    setModel,
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
          <div className='mt-2 flex flex-col gap-2'>
            <TextField
              id="apiKey"
              label="OpenAI API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              error={apiKeyError}
              ></TextField>
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
                    models.map((model) => (
                      <MenuItem key="model" value={model}>{model}</MenuItem>
                    ))
                  }
              </Select>
            </div>
          </div>
        </DialogContent>

      </Dialog>
    </div>
  );
};

export default Setting;
