import { Todo } from "@/app/actions";
import React from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  todo: Todo;
  index: number;
  handleCheck: (id: number, index: number) => void;
  handleDel: (index: number) => void;
  handleEditClick: (index: number) => void;
};

const TodoItem = ({
  todo,
  index,
  handleCheck,
  handleDel,
  handleEditClick,
}: Props) => {
  return (
    <div className="flex justify-between items-center mb-2" key={index}>
      {/* Checkbox */}
      <div className="flex items-center gap-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => handleCheck(todo.id, index)} // Handle checkbox change
          id={`${index}`}
        />
        <label
          htmlFor={`${index}`}
          className={`text-xl ${todo.completed ? "line-through" : ""}`}
        >
          {todo.name}
        </label>
      </div>

      {/* Edit & Delete Btn */}
      <div className="flex gap-4 text-xl">
        <button
          className="hover:text-green-600 transition-colors"
          onClick={() => {
            handleEditClick(index);
          }}
        >
          <LuPencil />
        </button>
        <button
          className="hover:text-red-600 transition-colors"
          onClick={() => handleDel(index)}
        >
          <LuTrash2 />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
