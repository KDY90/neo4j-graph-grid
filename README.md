# React Hierarchical Grid & Accordion Columns Demo

This project demonstrates two libraries to achieve **Tree Data Hierarchy** and **Collapsible (Accordion) Column Groups**.

## Demos

### 1. AG Grid (Enterprise)
*   **Path**: `/ag-grid`
*   **Pros**: Out-of-the-box support for Tree Data, Row Grouping, and Column Grouping. Very little custom code needed.
*   **Cons**: Requires Enterprise license for Tree/Row grouping. Heavier bundle.

### 2. TanStack Table (Headless)
*   **Path**: `/tanstack`
*   **Code**: `src/TanStackGrid/TanStackHierarchicalGrid.tsx`
*   **Pros**: Fully customizable, lighter weight, free (MIT).
*   **Cons**: Requires building features manually (e.g., custom recursion for tree data rendering, custom state logic for toggling column groups).

## Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:5173 to see the main menu.
