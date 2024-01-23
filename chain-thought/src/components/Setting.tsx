import { useState } from 'react';
import { Dialog } from '@mui/material';
import { DialogTitle, DialogContent } from '@mui/material';
import TextField from '@mui/material/TextField';
import SettingsIcon from '@mui/icons-material/Settings';

import { useSettingStore } from '../store';


const Seeting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { apiKey, setApiKey } = useSettingStore((state) => state);

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
          <div className='mt-2'></div>
          <TextField
            id="apiKey"
            label="OpenAI API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            > </TextField>
        </DialogContent>

      </Dialog>
    </div>
  );
};

export default Seeting;
