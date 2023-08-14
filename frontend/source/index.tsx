import 'vite/modulepreload-polyfill'
import React from 'react';
import './styles.css';
import { createRoot } from 'react-dom/client';
import { FilterBar } from './categories';
import { Search } from './search';

createRoot(document.getElementById('filters')!).render(<FilterBar />);

createRoot(document.getElementById('search')!).render(<Search />);
