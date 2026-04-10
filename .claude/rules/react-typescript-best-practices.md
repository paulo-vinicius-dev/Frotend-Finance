# Boas Práticas — React com TypeScript

> **Propósito:** Referência para agentes de IA e desenvolvedores gerarem código React + TypeScript consistente, type-safe, performático e manutenível. Cada seção contém regras obrigatórias, justificativas, exemplos corretos e antipatterns a evitar.

---

## Índice

1. [TypeScript — Fundamentos e Regras](#1-typescript--fundamentos-e-regras)
2. [Tipagem de Componentes](#2-tipagem-de-componentes)
3. [Props — Padrões e Técnicas Avançadas](#3-props--padrões-e-técnicas-avançadas)
4. [Hooks — Tipagem e Boas Práticas](#4-hooks--tipagem-e-boas-práticas)
5. [Custom Hooks — Arquitetura e Padrões](#5-custom-hooks--arquitetura-e-padrões)
6. [Eventos e Refs](#6-eventos-e-refs)
7. [Context API — Tipagem Segura](#7-context-api--tipagem-segura)
8. [Gerenciamento de Estado](#8-gerenciamento-de-estado)
9. [Formulários Tipados](#9-formulários-tipados)
10. [Comunicação com API](#10-comunicação-com-api)
11. [Componentes Genéricos](#11-componentes-genéricos)
12. [Patterns de Composição](#12-patterns-de-composição)
13. [Render Patterns](#13-render-patterns)
14. [Organização de Tipos](#14-organização-de-tipos)
15. [Performance e Memoização](#15-performance-e-memoização)
16. [Error Boundaries e Tratamento de Erros](#16-error-boundaries-e-tratamento-de-erros)
17. [Testes com TypeScript](#17-testes-com-typescript)
18. [Configuração do Projeto](#18-configuração-do-projeto)
19. [Antipatterns — O Que Nunca Fazer](#19-antipatterns--o-que-nunca-fazer)
20. [Checklist para o Agente de IA](#20-checklist-para-o-agente-de-ia)

---

## 1. TypeScript — Fundamentos e Regras

### 1.1 Regras Obrigatórias

- **Sempre** `strict: true` no tsconfig — não negociável.
- **Nunca** usar `any`. Usar `unknown` quando o tipo é desconhecido, depois fazer narrowing.
- Preferir **`type`** para props, unions, intersections e tipos utilitários.
- Preferir **`interface`** para shapes de objetos extensíveis e definição de contratos (APIs, models).
- **Nunca** usar type assertions (`as`) sem necessidade real — é um escape hatch, não padrão.
- **Exportar** todos os tipos que podem ser reutilizados.
- Usar **`satisfies`** para validar tipos sem perder inferência.
- Usar **`as const`** para literais imutáveis.

### 1.2 `type` vs `interface` — Quando Usar

```typescript
// TYPE — para props de componentes, unions, intersections, mapped types
type ButtonProps = {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  onPress: () => void;
};

type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

type Theme = 'light' | 'dark';


// INTERFACE — para contratos de API, models, objetos extensíveis
interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AdminUser extends User {
  permissions: string[];
  lastLoginAt: string;
}
```

### 1.3 Narrowing de Tipos

```typescript
// Type guard com typeof
function formatValue(value: string | number): string {
  if (typeof value === 'number') {
    return value.toFixed(2); // TS sabe que é number
  }
  return value.toUpperCase(); // TS sabe que é string
}


// Type guard com in
type SuccessResponse = { data: User; status: 'ok' };
type ErrorResponse = { error: string; status: 'fail' };
type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(res: ApiResponse) {
  if (res.status === 'ok') {
    console.log(res.data); // TS sabe que é SuccessResponse
  } else {
    console.error(res.error); // TS sabe que é ErrorResponse
  }
}


// Custom type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value
  );
}
```

### 1.4 `satisfies` — Validar Sem Perder Inferência

```typescript
// satisfies valida o tipo, mas preserva o tipo literal inferido
const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
} satisfies Record<string, string | ((...args: string[]) => string)>;

// TS sabe que ROUTES.HOME é '/' (literal), não apenas string
// TS sabe que ROUTES.USER_DETAIL é uma função, não string


// as const vs satisfies
const STATUS_MAP = {
  active: { label: 'Ativo', color: 'green' },
  inactive: { label: 'Inativo', color: 'gray' },
  blocked: { label: 'Bloqueado', color: 'red' },
} as const satisfies Record<string, { label: string; color: string }>;

type Status = keyof typeof STATUS_MAP; // 'active' | 'inactive' | 'blocked'
```

### 1.5 Utility Types Essenciais

```typescript
// Nativos do TypeScript — usar extensivamente
Partial<T>          // Todos os campos opcionais
Required<T>         // Todos os campos obrigatórios
Pick<T, K>          // Selecionar campos específicos
Omit<T, K>          // Remover campos específicos
Record<K, V>        // Mapa de chave-valor
Readonly<T>         // Todos os campos readonly
NonNullable<T>      // Remove null e undefined
ReturnType<T>       // Tipo de retorno de uma função
Parameters<T>       // Tupla dos parâmetros de uma função
Awaited<T>          // Resolve o tipo de uma Promise
Extract<T, U>       // Extrai membros de um union que são atribuíveis a U
Exclude<T, U>       // Remove membros de um union que são atribuíveis a U


// Utility types customizados úteis
type RequireFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

type StrictOmit<T, K extends keyof T> = Omit<T, K>;
// Diferente de Omit nativo: K deve ser uma chave real de T

type Prettify<T> = { [K in keyof T]: T[K] } & {};
// "Achata" intersections para exibição legível no hover

type MaybePromise<T> = T | Promise<T>;
```

---

## 2. Tipagem de Componentes

### 2.1 Regras Obrigatórias

- **Sempre** function components com arrow functions.
- **Nunca** class components (código legado é exceção).
- Props tipadas explicitamente com `type`, não inline.
- **Não** usar `React.FC` — tipar diretamente via parâmetro.
- Props desestruturadas nos **parâmetros da função**, não no corpo.
- Valores default via **default parameter**, não `defaultProps`.

### 2.2 Anatomia do Componente Tipado

```typescript
// src/components/ui/UserCard.tsx
import { memo, useCallback } from 'react';

// 1. Definir tipo das props (exportar se reutilizável)
type UserCardProps = {
  /** Nome completo do usuário */
  name: string;
  /** Email do usuário */
  email: string;
  /** Se o card está selecionado */
  isSelected?: boolean;
  /** Callback ao clicar no card */
  onSelect: (email: string) => void;
};

// 2. Componente com tipagem direta (sem React.FC)
const UserCard = ({
  name,
  email,
  isSelected = false,  // Default via parâmetro
  onSelect,
}: UserCardProps) => {
  const handleClick = useCallback(() => {
    onSelect(email);
  }, [onSelect, email]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      aria-selected={isSelected}
    >
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
};

export default memo(UserCard);
```

### 2.3 Por Que Não Usar `React.FC`

```typescript
// ❌ React.FC — problemas:
// 1. Aceitava children implicitamente (React 17) — comportamento confuso
// 2. Impede generics no componente
// 3. Dificulta tipagem de defaultProps
// 4. Adiciona complexidade sem benefício
const MyComponent: React.FC<Props> = (props) => { ... };

// ✅ Tipagem direta — mais simples, flexível e explícita
const MyComponent = (props: Props) => { ... };

// ✅ Com generics — impossível com React.FC
const GenericList = <T,>(props: ListProps<T>) => { ... };
```

### 2.4 Componente com children Explícito

```typescript
// children NUNCA é implícito — declarar quando necessário
type LayoutProps = {
  children: React.ReactNode;  // Aceita qualquer conteúdo renderizável
  sidebar?: React.ReactNode;
};

const Layout = ({ children, sidebar }: LayoutProps) => (
  <div className="layout">
    {sidebar && <aside>{sidebar}</aside>}
    <main>{children}</main>
  </div>
);


// Para children específicos (render props, funções)
type DataProviderProps<T> = {
  children: (data: T, isLoading: boolean) => React.ReactNode;
};
```

---

## 3. Props — Padrões e Técnicas Avançadas

### 3.1 Props com Discriminated Union

```typescript
// Quando props dependem umas das outras, usar discriminated union

// ERRADO — permite estados impossíveis
type BadAlertProps = {
  variant: 'info' | 'error' | 'success';
  message: string;
  onRetry?: () => void;  // Faz sentido só com error
  autoClose?: boolean;   // Não faz sentido com error
};

// CORRETO — discriminated union impede combinações inválidas
type AlertProps =
  | {
      variant: 'info';
      message: string;
      autoClose?: boolean;
    }
  | {
      variant: 'error';
      message: string;
      onRetry: () => void;       // Obrigatório para error
    }
  | {
      variant: 'success';
      message: string;
      autoClose?: boolean;
    };

const Alert = (props: AlertProps) => {
  if (props.variant === 'error') {
    // TS sabe que onRetry existe aqui
    return (
      <div role="alert">
        <p>{props.message}</p>
        <button onClick={props.onRetry}>Tentar novamente</button>
      </div>
    );
  }
  // ...
};
```

### 3.2 Extending HTML Elements

```typescript
// Estender props nativas de um elemento HTML
type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className,
  ...rest  // Resto das props nativas do <button>
}: ButtonProps) => (
  <button
    disabled={disabled || loading}
    className={cn(styles.base, styles[variant], styles[size], className)}
    {...rest}  // onClick, type, aria-*, etc.
  >
    {loading ? <Spinner /> : children}
  </button>
);


// Com ref — usar ComponentPropsWithRef ou forwardRef
type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  label: string;
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...rest }, ref) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input ref={ref} id={id} aria-invalid={!!error} {...rest} />
      {error && <span role="alert">{error}</span>}
    </div>
  ),
);
Input.displayName = 'Input';
```

### 3.3 Polymorphic Component (`as` Prop)

```typescript
// Componente que pode renderizar como qualquer elemento HTML ou componente
type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'children'>;

type TextProps<E extends React.ElementType = 'span'> = PolymorphicProps<E> & {
  variant?: 'body' | 'heading' | 'caption';
  weight?: 'normal' | 'medium' | 'bold';
};

const Text = <E extends React.ElementType = 'span'>({
  as,
  variant = 'body',
  weight = 'normal',
  children,
  className,
  ...rest
}: TextProps<E>) => {
  const Component = as || 'span';
  return (
    <Component
      className={cn(styles[variant], styles[weight], className)}
      {...rest}
    >
      {children}
    </Component>
  );
};


// Uso — TS valida as props do elemento correto
<Text>Texto padrão (span)</Text>
<Text as="h1" variant="heading">Título (h1)</Text>
<Text as="a" href="/about">Link (a)</Text>
<Text as="label" htmlFor="email">Label (label)</Text>
// <Text as="a" htmlFor="x" />  // ❌ Erro: <a> não tem htmlFor
```

### 3.4 Callback Props Tipadas

```typescript
// Tipar callbacks com precisão

type TableProps<T> = {
  data: T[];
  onRowClick: (item: T, index: number) => void;
  onSort: (column: keyof T, direction: 'asc' | 'desc') => void;
  onSelectionChange: (selectedIds: Set<string>) => void;
  renderCell: (item: T, column: keyof T) => React.ReactNode;
};


// Event handler com tipo de evento específico
type SearchInputProps = {
  onSearch: (query: string) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};
```

---

## 4. Hooks — Tipagem e Boas Práticas

### 4.1 useState

```typescript
// Inferência automática (suficiente para tipos simples)
const [count, setCount] = useState(0);           // number
const [name, setName] = useState('');             // string
const [isOpen, setIsOpen] = useState(false);      // boolean


// Tipagem explícita necessária quando:

// 1. Valor inicial não revela o tipo completo
const [user, setUser] = useState<User | null>(null);

// 2. Arrays e objetos complexos
const [items, setItems] = useState<Product[]>([]);

// 3. Union types
type Tab = 'overview' | 'settings' | 'billing';
const [activeTab, setActiveTab] = useState<Tab>('overview');

// 4. Estado complexo — preferir useReducer
const [filters, setFilters] = useState<FilterState>({
  search: '',
  category: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
});
```

### 4.2 useReducer

```typescript
// Estado complexo com múltiplas transições — useReducer é mais type-safe

type State = {
  items: Product[];
  selectedIds: Set<string>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
};

// Discriminated union para ações — cada ação tem seu payload específico
type Action =
  | { type: 'SET_ITEMS'; payload: Product[] }
  | { type: 'TOGGLE_SELECT'; payload: string }
  | { type: 'SELECT_ALL' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_SORT'; payload: { sortBy: string; sortOrder: 'asc' | 'desc' } }
  | { type: 'SET_LOADING'; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, isLoading: false };

    case 'TOGGLE_SELECT': {
      const next = new Set(state.selectedIds);
      next.has(action.payload) ? next.delete(action.payload) : next.add(action.payload);
      return { ...state, selectedIds: next };
    }

    case 'SELECT_ALL':
      return {
        ...state,
        selectedIds: new Set(state.items.map((i) => i.id)),
      };

    case 'CLEAR_SELECTION':
      return { ...state, selectedIds: new Set() };

    case 'SET_SORT':
      return { ...state, ...action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
  }
}

// Uso
const [state, dispatch] = useReducer(reducer, {
  items: [],
  selectedIds: new Set(),
  sortBy: 'name',
  sortOrder: 'asc',
  isLoading: true,
});

dispatch({ type: 'TOGGLE_SELECT', payload: productId });
dispatch({ type: 'SET_SORT', payload: { sortBy: 'price', sortOrder: 'desc' } });
// dispatch({ type: 'SET_SORT', payload: 'price' });  // ❌ Erro de tipo
```

### 4.3 useRef

```typescript
// Ref para elementos DOM
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);

// Acessar após mount (com null check)
const focusInput = () => {
  inputRef.current?.focus();  // Optional chaining — seguro
};


// Ref como valor mutável (sem re-render)
const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
const prevValueRef = useRef<string>(initialValue);
const renderCountRef = useRef(0);

// Limpar timer no cleanup
useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, []);


// Ref para instância de componente (raro — preferir composição)
type ChildHandle = {
  reset: () => void;
  focus: () => void;
};

const childRef = useRef<ChildHandle>(null);
```

### 4.4 useMemo e useCallback

```typescript
// useMemo — para VALORES derivados caros
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items],
);

const stats = useMemo(() => ({
  total: items.length,
  active: items.filter((i) => i.isActive).length,
  revenue: items.reduce((sum, i) => sum + i.price, 0),
}), [items]);


// useCallback — para FUNÇÕES passadas a componentes memoizados
const handleDelete = useCallback((id: string) => {
  setItems((prev) => prev.filter((item) => item.id !== id));
}, []);

const handleSearch = useCallback((query: string) => {
  setFilters((prev) => ({ ...prev, search: query, page: 1 }));
}, []);

// Tipagem explícita quando necessário
const handleSort = useCallback<(column: string, dir: 'asc' | 'desc') => void>(
  (column, dir) => {
    dispatch({ type: 'SET_SORT', payload: { sortBy: column, sortOrder: dir } });
  },
  [],
);
```

---

## 5. Custom Hooks — Arquitetura e Padrões

### 5.1 Regras Obrigatórias

- Custom hooks **sempre** começam com `use`.
- Retornar **objeto nomeado** quando tiver 3+ valores (não tupla).
- Retornar **tupla** para hooks simples de 1–2 valores (padrão useState-like).
- Tipar o **retorno explicitamente** quando complexo.
- Extrair lógica do componente quando: >15 linhas de hooks, reutilizável, ou testável separadamente.

### 5.2 Hook com Retorno Tipado

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### 5.3 Hook de Toggle

```typescript
// src/hooks/useToggle.ts
import { useState, useCallback } from 'react';

export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse } as const;
}

// Uso
const { value: isOpen, toggle, setFalse: close } = useToggle();
```

### 5.4 Hook de Feature Complexo

```typescript
// src/features/products/hooks/useProductList.ts
import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { useDebounce } from '@hooks/useDebounce';
import type { ListParams, PaginatedResponse } from '@types/api.types';
import type { Product } from '../types/product.types';

type UseProductListParams = {
  initialCategory?: string;
  perPage?: number;
};

type UseProductListReturn = {
  /** Dados paginados retornados pela API */
  data: PaginatedResponse<Product> | undefined;
  /** Estado de carregamento */
  isLoading: boolean;
  /** Erro da query */
  error: Error | null;
  /** Parâmetros de filtro atuais */
  params: ListParams;
  /** Atualizar texto de busca */
  setSearch: (search: string) => void;
  /** Navegar para uma página específica */
  setPage: (page: number) => void;
  /** Alternar ordenação */
  toggleSort: (column: string) => void;
  /** Filtrar por categoria */
  setCategory: (category: string | null) => void;
};

export function useProductList({
  initialCategory,
  perPage = 20,
}: UseProductListParams = {}): UseProductListReturn {
  const [params, setParams] = useState<ListParams & { category?: string | null }>({
    page: 1,
    perPage,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    category: initialCategory ?? null,
  });

  const debouncedSearch = useDebounce(params.search, 300);

  const queryParams = useMemo(
    () => ({ ...params, search: debouncedSearch }),
    [params, debouncedSearch],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => productService.list(queryParams),
    placeholderData: (prev) => prev,
  });

  const setSearch = useCallback((search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const toggleSort = useCallback((column: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const setCategory = useCallback((category: string | null) => {
    setParams((prev) => ({ ...prev, category, page: 1 }));
  }, []);

  return {
    data,
    isLoading,
    error: error as Error | null,
    params,
    setSearch,
    setPage,
    toggleSort,
    setCategory,
  };
}
```

### 5.5 Hook com Generics

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useCallback, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Uso — TS infere T do initialValue
const [theme, setTheme] = useLocalStorage('theme', 'light');
// theme: string, setTheme: (value: string | ((prev: string) => string)) => void

const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
// Tipagem explícita quando o initialValue é vazio
```

---

## 6. Eventos e Refs

### 6.1 Tipos de Eventos Comuns

```typescript
// Eventos de formulário
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setQuery(e.target.value);
};

const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setCategory(e.target.value);
};

const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setDescription(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // ...
};


// Eventos de mouse
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { };
const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => { };


// Eventos de teclado
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSearch();
  }
  if (e.key === 'Escape') {
    handleClose();
  }
};


// Eventos de foco
const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => { };
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => { };


// Drag events
const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => { };
const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
};
```

### 6.2 Event Handler Types (para Props)

```typescript
// Quando declarar callbacks em props, usar os tipos de handler
type FormFieldProps = {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

// Equivalente a:
type FormFieldPropsExplicit = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};
```

### 6.3 useImperativeHandle

```typescript
// Expor métodos de um componente filho para o pai

type FormHandle = {
  reset: () => void;
  focus: () => void;
  validate: () => boolean;
};

type SearchFormProps = {
  onSearch: (query: string) => void;
};

const SearchForm = React.forwardRef<FormHandle, SearchFormProps>(
  ({ onSearch }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');

    React.useImperativeHandle(ref, () => ({
      reset: () => {
        setQuery('');
        inputRef.current?.focus();
      },
      focus: () => inputRef.current?.focus(),
      validate: () => query.trim().length > 0,
    }));

    return (
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    );
  },
);


// Uso no pai
const formRef = useRef<FormHandle>(null);
formRef.current?.reset();
```

---

## 7. Context API — Tipagem Segura

### 7.1 Regras

- **Sempre** tipar o valor do Context.
- Criar `createContext(null)` e **validar** no hook consumidor — nunca usar valor default falso.
- Exportar **apenas o hook**, não o Context diretamente.
- Context para: dados que mudam pouco e são consumidos por muitos componentes (auth, tema, locale).
- **Nunca** usar Context para estado que muda frequentemente (causa re-render cascata).

### 7.2 Pattern Completo

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useMemo, useCallback, useState } from 'react';

// 1. Tipos
interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
}

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

// 2. Context com null (não default value fake)
const AuthContext = createContext<AuthContextValue | null>(null);

// 3. Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    authService.logout();
  }, []);

  // Memoizar para evitar re-renders desnecessários no provider
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Hook consumidor com validação (única exportação pública)
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return context;
}
```

### 7.3 Context com Generics (Pattern Avançado)

```typescript
// Factory para criar Context + Provider + Hook tipados

function createStrictContext<T>(name: string) {
  const Context = createContext<T | null>(null);

  function useStrictContext(): T {
    const value = useContext(Context);
    if (value === null) {
      throw new Error(`use${name} deve ser usado dentro de <${name}Provider>`);
    }
    return value;
  }

  return [Context.Provider, useStrictContext] as const;
}

// Uso
type ThemeContextValue = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const [ThemeProvider, useTheme] = createStrictContext<ThemeContextValue>('Theme');
```

---

## 8. Gerenciamento de Estado

### 8.1 Tabela de Decisão

| Tipo de Estado | Ferramenta | Exemplo |
|---|---|---|
| Server state | **React Query** | Dados da API, listas, detalhes |
| Global UI | **Zustand** | Sidebar, theme, notificações |
| Form | **React Hook Form** | Inputs de formulário |
| Local | **useState** | Modal aberto, input temporário |
| Complexo local | **useReducer** | Filtros com múltiplas ações |
| Derivado | **useMemo** / variável | Itens filtrados, totais |
| Auth/Tema | **Context** | Usuário logado, idioma |

### 8.2 Zustand Tipado

```typescript
// src/stores/uiStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface UiState {
  sidebarOpen: boolean;
  themeMode: ThemeMode;
}

interface UiActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useUiStore = create<UiState & UiActions>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        themeMode: 'system',
        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setThemeMode: (mode) => set({ themeMode: mode }),
      }),
      { name: 'ui-store' },
    ),
    { name: 'UiStore' },
  ),
);

// Selectors específicos (evita re-render desnecessário)
// ✅ Seleciona apenas o que precisa
const sidebarOpen = useUiStore((s) => s.sidebarOpen);
const toggleSidebar = useUiStore((s) => s.toggleSidebar);

// ❌ Subscreve a todo o store — re-render em qualquer mudança
const store = useUiStore();
```

### 8.3 React Query — Tipagem Completa

```typescript
// Query keys tipadas
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: ListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook tipado
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),  // Retorno tipado no service
    enabled: !!id,
  });
  // Retorna UseQueryResult<User, Error>
}

// Mutation tipada
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdate }) =>
      userService.update(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
  // Retorna UseMutationResult<User, Error, { id: string; data: UserUpdate }>
}
```

---

## 9. Formulários Tipados

### 9.1 React Hook Form + Zod

```typescript
// src/features/users/schemas/userSchema.ts
import { z } from 'zod';

export const userCreateSchema = z.object({
  fullName: z.string().trim().min(1, 'Nome é obrigatório').max(150),
  email: z.string().trim().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter maiúscula')
    .regex(/[0-9]/, 'Deve conter número'),
  confirmPassword: z.string().min(1, 'Confirmação obrigatória'),
  role: z.enum(['user', 'manager', 'admin']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

// Tipo inferido do schema — SINGLE SOURCE OF TRUTH
export type UserCreateFormData = z.infer<typeof userCreateSchema>;
```

```typescript
// src/features/users/components/UserCreateForm.tsx
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userCreateSchema, type UserCreateFormData } from '../schemas/userSchema';

const UserCreateForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
  });

  const onSubmit: SubmitHandler<UserCreateFormData> = async (data) => {
    // data é UserCreateFormData — totalmente tipado
    await userService.create(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Controller
        name="fullName"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Nome completo"
            error={errors.fullName?.message}
          />
        )}
      />
      {/* ... outros campos ... */}
      <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
        Criar
      </Button>
    </form>
  );
};
```

### 9.2 Form Field Genérico (Eliminar Boilerplate)

```typescript
// src/components/ui/FormField.tsx
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

type FormFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
};

function FormField<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input
          {...field}
          label={label}
          type={type}
          placeholder={placeholder}
          error={error?.message}
        />
      )}
    />
  );
}


// Uso — name é type-safe (autocomplete de campos do schema)
<FormField name="email" control={control} label="Email" type="email" />
<FormField name="fullName" control={control} label="Nome" />
// <FormField name="nonExistent" ... />  // ❌ Erro de tipo
```

---

## 10. Comunicação com API

### 10.1 Service Tipado

```typescript
// src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30_000,
});


// src/features/users/services/userService.ts
import { api } from '@services/api';
import type { PaginatedResponse, ListParams } from '@types/api.types';
import type { User, UserCreate, UserUpdate } from '../types/user.types';

class UserService {
  private readonly base = '/users';

  async list(params?: ListParams): Promise<PaginatedResponse<User>> {
    const { data } = await api.get<PaginatedResponse<User>>(this.base, { params });
    return data;
  }

  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`${this.base}/${id}`);
    return data;
  }

  async create(payload: UserCreate): Promise<User> {
    const { data } = await api.post<User>(this.base, payload);
    return data;
  }

  async update(id: string, payload: UserUpdate): Promise<User> {
    const { data } = await api.patch<User>(`${this.base}/${id}`, payload);
    return data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.base}/${id}`);
  }
}

export const userService = new UserService();
```

### 10.2 Tipos de Resposta da API

```typescript
// src/types/api.types.ts

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ApiError {
  detail: string;
  statusCode: number;
  fieldErrors?: Array<{
    field: string;
    message: string;
  }>;
}

export type ListParams = {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
```

---

## 11. Componentes Genéricos

### 11.1 Lista Genérica

```typescript
// src/components/ui/DataList.tsx
type DataListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
};

function DataList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'Nenhum item encontrado',
  isLoading = false,
}: DataListProps<T>) {
  if (isLoading) return <Skeleton count={5} />;

  if (items.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}


// Uso — T é inferido do items
<DataList
  items={users}                           // T = User
  renderItem={(user) => <UserCard user={user} />}  // user: User ✅
  keyExtractor={(user) => user.id}        // user: User ✅
/>
```

### 11.2 Tabela Genérica

```typescript
type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  onSort,
  sortBy,
  sortOrder,
}: DataTableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{ width: col.width }}
              onClick={() =>
                col.sortable && onSort?.(col.key, sortOrder === 'asc' ? 'desc' : 'asc')
              }
            >
              {col.header}
              {col.sortable && sortBy === col.key && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={keyExtractor(item)} onClick={() => onRowClick?.(item)}>
            {columns.map((col) => (
              <td key={col.key}>{col.render(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Uso
const columns: Column<User>[] = [
  { key: 'name', header: 'Nome', render: (u) => u.fullName, sortable: true },
  { key: 'email', header: 'Email', render: (u) => u.email, sortable: true },
  { key: 'role', header: 'Perfil', render: (u) => <Badge>{u.role}</Badge> },
  {
    key: 'actions',
    header: '',
    width: '80px',
    render: (u) => <ActionMenu userId={u.id} />,
  },
];

<DataTable data={users} columns={columns} keyExtractor={(u) => u.id} />
```

### 11.3 Select Genérico

```typescript
type SelectOption<V extends string = string> = {
  value: V;
  label: string;
  disabled?: boolean;
};

type SelectProps<V extends string = string> = {
  options: readonly SelectOption<V>[];
  value: V | null;
  onChange: (value: V) => void;
  placeholder?: string;
  label?: string;
  error?: string;
};

function Select<V extends string>({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  label,
  error,
}: SelectProps<V>) {
  return (
    <div>
      {label && <label>{label}</label>}
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value as V)}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span>{error}</span>}
    </div>
  );
}

// Uso — value é tipado como o union literal dos options
const ROLE_OPTIONS = [
  { value: 'user', label: 'Usuário' },
  { value: 'admin', label: 'Admin' },
] as const satisfies readonly SelectOption[];

type Role = (typeof ROLE_OPTIONS)[number]['value']; // 'user' | 'admin'

<Select<Role>
  options={ROLE_OPTIONS}
  value={selectedRole}
  onChange={setSelectedRole}  // (value: Role) => void
/>
```

---

## 12. Patterns de Composição

### 12.1 Compound Components

```typescript
// Componentes que funcionam juntos com estado compartilhado implícito

type AccordionContextValue = {
  openItems: Set<string>;
  toggle: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion compound components must be used within <Accordion>');
  return ctx;
}

// Root
type AccordionProps = {
  children: React.ReactNode;
  multiple?: boolean;
  defaultOpen?: string[];
};

const Accordion = ({ children, multiple = false, defaultOpen = [] }: AccordionProps) => {
  const [openItems, setOpenItems] = useState(new Set(defaultOpen));

  const toggle = useCallback((id: string) => {
    setOpenItems((prev) => {
      const next = new Set(multiple ? prev : []);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, [multiple]);

  const value = useMemo(() => ({ openItems, toggle }), [openItems, toggle]);

  return (
    <AccordionContext.Provider value={value}>
      <div role="region">{children}</div>
    </AccordionContext.Provider>
  );
};

// Item
type AccordionItemProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

const AccordionItem = ({ id, title, children }: AccordionItemProps) => {
  const { openItems, toggle } = useAccordionContext();
  const isOpen = openItems.has(id);

  return (
    <div>
      <button
        onClick={() => toggle(id)}
        aria-expanded={isOpen}
        aria-controls={`panel-${id}`}
      >
        {title}
      </button>
      {isOpen && (
        <div id={`panel-${id}`} role="region">
          {children}
        </div>
      )}
    </div>
  );
};

Accordion.Item = AccordionItem;

// Uso
<Accordion multiple defaultOpen={['faq-1']}>
  <Accordion.Item id="faq-1" title="O que é isso?">
    <p>Resposta aqui</p>
  </Accordion.Item>
  <Accordion.Item id="faq-2" title="Como funciona?">
    <p>Explicação aqui</p>
  </Accordion.Item>
</Accordion>
```

### 12.2 Render Props Tipadas

```typescript
type FetchProps<T> = {
  url: string;
  children: (state: {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
};

function Fetch<T>({ url, children }: FetchProps<T>) {
  const { data, isLoading, error, refetch } = useQuery<T>({
    queryKey: [url],
    queryFn: () => api.get(url).then((r) => r.data),
  });

  return <>{children({ data: data ?? null, isLoading, error, refetch })}</>;
}

// Uso
<Fetch<User[]> url="/users">
  {({ data, isLoading }) => (
    isLoading ? <Spinner /> : <UserList users={data ?? []} />
  )}
</Fetch>
```

### 12.3 Higher-Order Component (HOC) Tipado

```typescript
// HOC para adicionar autenticação a qualquer componente
function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const WithAuthComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <LoadingScreen />;
    if (!isAuthenticated) return <Navigate to="/login" />;

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
}

// Uso
const ProtectedDashboard = withAuth(DashboardPage);
// Nota: preferir wrapper components (<AuthGuard>) sobre HOCs no React moderno
```

---

## 13. Render Patterns

### 13.1 Conditional Rendering Tipado

```typescript
// Pattern 1: Early return (preferido para estados de página)
const UserPage = () => {
  const { data, isLoading, isError, error } = useUser(userId);

  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorFallback message={error.message} />;
  if (!data) return <EmptyState />;

  // Daqui em diante, data é User (não null)
  return <UserProfile user={data} />;
};


// Pattern 2: Inline para pequenas variações
const StatusBadge = ({ status }: { status: OrderStatus }) => (
  <span className={cn(styles.badge, styles[status])}>
    {status === 'completed' && <CheckIcon />}
    {status === 'cancelled' && <XIcon />}
    {STATUS_LABELS[status]}
  </span>
);


// Pattern 3: Map de renderização (substituir switch/if chains)
const VARIANT_ICON: Record<AlertVariant, React.ComponentType> = {
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  success: SuccessIcon,
};

const Alert = ({ variant, message }: AlertProps) => {
  const Icon = VARIANT_ICON[variant];
  return (
    <div role="alert">
      <Icon />
      <span>{message}</span>
    </div>
  );
};
```

### 13.2 Renderização de Listas

```typescript
// SEMPRE usar key estável (ID do item, nunca index)
<ul>
  {items.map((item) => (
    <ListItem key={item.id} item={item} onSelect={handleSelect} />
  ))}
</ul>

// Fragmento com key (quando precisar de wrapper sem DOM)
{groups.map((group) => (
  <React.Fragment key={group.id}>
    <GroupHeader title={group.title} />
    {group.items.map((item) => (
      <GroupItem key={item.id} item={item} />
    ))}
  </React.Fragment>
))}
```

---

## 14. Organização de Tipos

### 14.1 Regras

- Tipos de **feature** ficam em `types/` dentro da feature.
- Tipos **globais** ficam em `src/types/`.
- Tipos de **props** ficam no mesmo arquivo do componente.
- Tipos de **API response/request** ficam em `types/` da feature.
- **Exportar** tipos que podem ser usados externamente.
- **Co-locate**: tipos perto de onde são usados.

### 14.2 Estrutura Recomendada

```
src/
├── types/                          # Tipos globais
│   ├── api.types.ts                # PaginatedResponse, ApiError, ListParams
│   ├── common.types.ts             # UUID, utility types
│   └── env.d.ts                    # Tipos de variáveis de ambiente
│
├── features/users/
│   ├── types/
│   │   └── user.types.ts           # User, UserCreate, UserUpdate, UserFilter
│   ├── components/
│   │   └── UserCard.tsx            # UserCardProps definido aqui (co-located)
│   └── hooks/
│       └── useUsers.ts             # UseUsersReturn definido aqui (co-located)
```

```typescript
// src/features/users/types/user.types.ts

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'manager' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export type UserCreate = Pick<User, 'email' | 'fullName' | 'role'> & {
  password: string;
};

export type UserUpdate = Partial<Pick<User, 'fullName' | 'email' | 'isActive'>>;

export type UserSummary = Pick<User, 'id' | 'fullName' | 'email' | 'role'>;

export type UserFilter = {
  search?: string;
  role?: User['role'];
  isActive?: boolean;
};
```

### 14.3 Variáveis de Ambiente

```typescript
// src/types/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_ENABLE_MOCK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 15. Performance e Memoização

### 15.1 Quando Memoizar

```typescript
// React.memo — quando o componente:
// ✅ É renderizado frequentemente pelo pai
// ✅ Recebe props estáveis (primitivos, objetos memoizados)
// ✅ É um item de lista em grandes listas
// ❌ Não memoizar por padrão — medir primeiro

// useMemo — quando:
// ✅ Cálculo caro (sort, filter, reduce em listas grandes)
// ✅ Objeto/array passado como prop para componente memoizado
// ✅ Valor computado que serve como dependência de outro hook
// ❌ Não para cálculos triviais

// useCallback — quando:
// ✅ Função passada como prop para componente memoizado
// ✅ Função usada como dependência de useEffect
// ❌ Não para event handlers de elementos HTML nativos (sem memo)
```

### 15.2 Padrão Completo

```typescript
// Item de lista memoizado
const ProductCard = memo(({ product, onSelect }: ProductCardProps) => {
  return (
    <div onClick={() => onSelect(product.id)}>
      <h3>{product.name}</h3>
      <span>{formatCurrency(product.price)}</span>
    </div>
  );
});

// Componente pai com handlers estáveis
const ProductList = ({ products }: { products: Product[] }) => {
  // useCallback para manter referência estável
  const handleSelect = useCallback((id: string) => {
    router.push(`/products/${id}`);
  }, []);

  // useMemo para cálculo derivado
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => b.price - a.price),
    [products],
  );

  return (
    <ul>
      {sortedProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={handleSelect}
        />
      ))}
    </ul>
  );
};
```

### 15.3 Lazy Loading de Componentes

```typescript
import { lazy, Suspense } from 'react';

// Lazy load de páginas (code splitting)
const DashboardPage = lazy(() => import('@features/dashboard/pages/DashboardPage'));
const UsersPage = lazy(() => import('@features/users/pages/UsersPage'));
const SettingsPage = lazy(() => import('@features/settings/pages/SettingsPage'));

// Suspense wrapper
const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageSkeleton />}>
    {children}
  </Suspense>
);

// Uso no router
{
  path: '/users',
  element: <LazyPage><UsersPage /></LazyPage>,
}


// Named export com lazy — precisa de wrapper
const UsersPage = lazy(() =>
  import('@features/users/pages/UsersPage').then((m) => ({
    default: m.UsersPage,
  })),
);
```

---

## 16. Error Boundaries e Tratamento de Erros

### 16.1 Error Boundary Tipado

```typescript
// src/components/feedback/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      return this.props.fallback ?? <DefaultErrorFallback onRetry={this.handleReset} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;


// Uso com render prop
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Erro: {error.message}</p>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )}
  onError={(error) => reportToSentry(error)}
>
  <App />
</ErrorBoundary>
```

### 16.2 Hook de Tratamento de Erro de API

```typescript
// src/hooks/useApiError.ts
import type { AxiosError } from 'axios';
import type { ApiError } from '@types/api.types';

export function getApiErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Erro desconhecido';
  }

  const apiError = error.response?.data as ApiError | undefined;
  if (apiError?.detail) {
    return typeof apiError.detail === 'string' ? apiError.detail : 'Erro de validação';
  }

  const statusMessages: Record<number, string> = {
    400: 'Dados inválidos',
    401: 'Sessão expirada',
    403: 'Sem permissão',
    404: 'Não encontrado',
    409: 'Conflito de dados',
    422: 'Erro de validação',
    429: 'Muitas tentativas',
    500: 'Erro no servidor',
  };

  return statusMessages[error.response?.status ?? 0] ?? 'Erro inesperado';
}

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError)?.isAxiosError === true;
}
```

---

## 17. Testes com TypeScript

### 17.1 Tipagem de Testes

```typescript
// src/features/users/components/UserCard.test.tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import UserCard from './UserCard';
import { renderWithProviders } from '@test/renderWithProviders';
import type { User } from '../types/user.types';

// Factory tipada para dados de teste
function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    email: 'john@example.com',
    fullName: 'John Doe',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: null,
    ...overrides,
  };
}

describe('UserCard', () => {
  it('deve exibir nome e email', () => {
    const user = createMockUser();
    renderWithProviders(<UserCard user={user} onSelect={vi.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('deve chamar onSelect com o ID ao clicar', async () => {
    const user = createMockUser({ id: 'abc-123' });
    const onSelect = vi.fn();

    renderWithProviders(<UserCard user={user} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledWith('abc-123');
  });
});
```

### 17.2 Mock de Hooks e Services

```typescript
// Mock de hook customizado
import * as useAuthModule from '@features/auth/hooks/useAuth';

vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
  user: createMockUser(),
  isAuthenticated: true,
  login: vi.fn(),
  logout: vi.fn(),
});


// Mock de service
vi.mock('../services/userService', () => ({
  userService: {
    list: vi.fn<[], Promise<PaginatedResponse<User>>>().mockResolvedValue({
      items: [createMockUser()],
      total: 1,
      page: 1,
      perPage: 20,
      totalPages: 1,
      hasNext: false,
    }),
    getById: vi.fn<[string], Promise<User>>().mockResolvedValue(createMockUser()),
  },
}));
```

### 17.3 Teste de Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useToggle } from './useToggle';

describe('useToggle', () => {
  it('deve iniciar com false por padrão', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.value).toBe(false);
  });

  it('deve alternar o valor', () => {
    const { result } = renderHook(() => useToggle());

    act(() => result.current.toggle());
    expect(result.current.value).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.value).toBe(false);
  });

  it('deve aceitar valor inicial', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.value).toBe(true);
  });
});
```

---

## 18. Configuração do Projeto

### 18.1 tsconfig.json Completo

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",

    // Strict
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": false,
    "forceConsistentCasingInFileNames": true,

    // Interop
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "skipLibCheck": true,

    // Output
    "noEmit": true,

    // Paths
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@features/*": ["./src/features/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@stores/*": ["./src/stores/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@test/*": ["./src/test/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 18.2 ESLint com TypeScript

```jsonc
// .eslintrc.cjs
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    'react/self-closing-comp': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
```

---

## 19. Antipatterns — O Que Nunca Fazer

| Antipattern | Por que é ruim | Correto |
|---|---|---|
| `any` em qualquer lugar | Desabilita type checking | `unknown` + narrowing |
| `as` para silenciar erros | Mascara bugs reais | Corrigir o tipo ou usar type guard |
| `React.FC` | Inflexível, implícito demais | Tipagem direta via parâmetro |
| Enum | Gera código JS, não é tree-shakeable | Union type + `as const` |
| Props inline `(props: { x: string })` | Não reutilizável, não documentável | `type` nomeado exportado |
| `interface IUser` | Prefixo húngaro desnecessário | `interface User` |
| `useState` + `useEffect` para derivar | Re-render extra desnecessário | `useMemo` ou variável |
| Componente dentro de componente | Nova referência a cada render | Definir no top-level do módulo |
| `index` como key em listas dinâmicas | Bugs ao reordenar/remover | ID estável do item |
| `defaultProps` | Deprecated, não funciona com TS | Default parameter |
| Object spread sem tipo (`{...props}`) | Props inesperadas passadas | Tipar e desestruturar explicitamente |
| `!` (non-null assertion) | Silencia null check sem validar | Optional chaining `?.` ou guard |
| `@ts-ignore` | Desabilita o compilador | `@ts-expect-error` (só se necessário) |
| Não exportar tipos | Impede reutilização | Exportar tipos de feature |

---

## 20. Checklist para o Agente de IA

### TypeScript
```
[ ] strict: true habilitado?
[ ] Nenhum uso de `any`?
[ ] `type` para props, `interface` para models?
[ ] Type assertions (`as`) apenas quando justificável?
[ ] Union types em vez de enums?
[ ] `satisfies` quando precisa validar sem perder inferência?
[ ] Utility types nativos usados (Partial, Pick, Omit)?
[ ] Tipos exportados quando reutilizáveis?
```

### Componentes
```
[ ] Function component com arrow function?
[ ] Sem React.FC — tipagem direta?
[ ] Props como `type` nomeado (não inline)?
[ ] Props desestruturadas no parâmetro?
[ ] Default values via default parameter?
[ ] children explícito quando necessário?
[ ] Sem componentes dentro de outros?
[ ] displayName em forwardRef?
```

### Hooks
```
[ ] useState com tipo explícito quando necessário?
[ ] useReducer para estado complexo com muitas ações?
[ ] useRef tipado corretamente (DOM | valor mutável)?
[ ] Custom hooks começam com `use`?
[ ] Custom hooks retornam objeto (3+ valores) ou tupla (1-2)?
[ ] Retorno de custom hook tipado explicitamente?
```

### Estado e API
```
[ ] Server state via React Query?
[ ] Query keys centralizadas e tipadas?
[ ] Services com tipos genéricos nas chamadas Axios?
[ ] Zustand com selectors específicos?
[ ] Context apenas para estado infrequente (auth, tema)?
```

### Formulários
```
[ ] Zod schema como single source of truth?
[ ] z.infer para tipo do form data?
[ ] Controller para componentes customizados?
[ ] FormField genérico para reduzir boilerplate?
[ ] name é type-safe (autocomplete)?
```

### Performance
```
[ ] memo em itens de lista renderizados frequentemente?
[ ] useCallback para handlers passados a filhos memoizados?
[ ] useMemo para cálculos caros?
[ ] Lazy loading em páginas?
[ ] key estável em listas (nunca index)?
```

### Testes
```
[ ] Factories tipadas para dados de teste?
[ ] Mocks com tipo correto (vi.fn<Params, Return>)?
[ ] renderWithProviders para contexto?
[ ] Testar comportamento, não implementação?
```

### Organização
```
[ ] Tipos co-locados (perto de onde são usados)?
[ ] Tipos globais em src/types/?
[ ] Tipos de props no mesmo arquivo do componente?
[ ] Imports com aliases (@components, @features)?
[ ] consistent-type-imports no ESLint?
```

---

## Dependências Recomendadas

```jsonc
{
  "dependencies": {
    "react": "^18.3",
    "react-dom": "^18.3",
    "@tanstack/react-query": "^5",
    "zustand": "^4.5",
    "react-hook-form": "^7.53",
    "@hookform/resolvers": "^3.9",
    "zod": "^3.23",
    "axios": "^1.7",
    "react-router-dom": "^6.26"
  },
  "devDependencies": {
    "typescript": "^5.6",
    "vite": "^5.4",
    "@vitejs/plugin-react": "^4.3",
    "vitest": "^2.1",
    "@testing-library/react": "^16",
    "@testing-library/jest-dom": "^6.5",
    "@testing-library/user-event": "^14.5",
    "jsdom": "^25",
    "eslint": "^8.57",
    "@typescript-eslint/eslint-plugin": "^8",
    "@typescript-eslint/parser": "^8",
    "eslint-plugin-react": "^7.37",
    "eslint-plugin-react-hooks": "^4.6",
    "eslint-config-prettier": "^9.1",
    "prettier": "^3.3"
  }
}
```
