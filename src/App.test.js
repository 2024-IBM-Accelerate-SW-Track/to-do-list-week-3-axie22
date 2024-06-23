import { unmountComponentAtNode } from 'react-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';


let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('test that App component renders', () => {
  render(<App />, container);
 });

test('test that new-item-button is a button', () => {
  render(<App/>, container);
  const element = screen.getByTestId('new-item-button');
  expect(element.tagName.toLowerCase().includes("button")).toBe(true)
  // expect(element.innerHTML.toLowerCase().includes("button")).toBe(true)
});

test('test that new-item-input is an input ', () => {
  render(<App/>, container);
  const element = screen.getByTestId('new-item-input');
  expect(element.innerHTML.toLowerCase().includes("input")).toBe(true)
});

test('test that no duplicate task is added', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputTask, { target: { value: "Duplicate Task" } });
  fireEvent.change(inputDate, { target: { value: "05/30/2023" } });
  fireEvent.click(addButton);

  fireEvent.change(inputTask, { target: { value: "Duplicate Task" } });
  fireEvent.change(inputDate, { target: { value: "05/30/2023" } });
  fireEvent.click(addButton);

  const tasks = screen.getAllByText(/Duplicate Task/i);
  expect(tasks.length).toBe(1);
});

test('test that task is not added with no due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const addButton = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputTask, { target: { value: "No Due Date Task" } });
  fireEvent.click(addButton);

  const task = screen.queryByText(/No Due Date Task/i);
  expect(task).not.toBeInTheDocument();
});

test('test that task is not added with no task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputDate, { target: { value: "05/30/2023" } });
  fireEvent.click(addButton);

  const task = screen.queryByText(/05\/30\/2023/i);
  expect(task).not.toBeInTheDocument();
});

test('test that late tasks have different colors', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });

  const pastDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "Late Task" } });
  fireEvent.change(inputDate, { target: { value: pastDate } });
  fireEvent.click(addButton);

  const taskCard = screen.getByText(/Late Task/i).closest('.MuiPaper-root'); // Adjust selector based on your Card component class
  expect(taskCard).toHaveStyle('background-color: #ffcccc'); // Adjust based on the exact color used
});

test('test that task can be deleted', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputTask, { target: { value: "Delete Task" } });
  fireEvent.change(inputDate, { target: { value: "05/30/2023" } });
  fireEvent.click(addButton);

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  const task = screen.queryByText(/Delete Task/i);
  expect(task).not.toBeInTheDocument();
});


