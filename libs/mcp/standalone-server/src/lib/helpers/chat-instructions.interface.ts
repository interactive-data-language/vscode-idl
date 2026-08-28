import type {
  ChatInstructionOption,
  ChatInstructionType,
} from '@idl/types/chat';

/**
 * Configured list of selectable chat instruction options
 */
export const CHAT_INSTRUCTION_OPTIONS: ChatInstructionOption[] = [
  { id: 'none', name: 'None', description: 'No system instructions' },
  { id: 'idl', name: 'IDL', description: 'IDL programming guidelines' },
  { id: 'envi', name: 'ENVI', description: 'ENVI remote sensing guidelines' },
  {
    id: 'idl-envi',
    name: 'IDL + ENVI',
    description: 'Combined IDL and ENVI guidelines',
  },
];

/**
 * Instruction type that should be selected by default
 */
export const DEFAULT_CHAT_INSTRUCTIONS: ChatInstructionType = 'idl-envi';
