import { useContext } from 'react';
import { AppSettingsContext } from './AppSettingsContextBase.js';
export function useAppSettings(){
  return useContext(AppSettingsContext);
}
