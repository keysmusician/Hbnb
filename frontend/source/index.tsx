import 'vite/modulepreload-polyfill'
import './categories.css';
import { createRoot } from 'react-dom/client';
import { FilterBar } from './categories';
import { Search } from './search';

createRoot(document.getElementById('search')!).render(<Search />);

createRoot(document.getElementById('filters')!).render(<FilterBar />);
