import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/shared/ui/Layout";
import { createMenuItem } from "@/entities/menuItem/model/api";
import { ROUTES } from "@/shared/consts/routeNames";

function CreateMenuItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    priority: 1,
    body: "",
  });

  const inputClassName =
    "border w-full mb-2 border-solid border-gray-400 bg-transparent p-3 rounded-xl";

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!form.body || !form.priority) return;
      await createMenuItem(form);
      resetForm();
      toast.success("Menu item Created");
      navigate(ROUTES.menuItems);
    } catch (err) {
      if (!navigator.onLine) {
        resetForm();
        return toast.success(
          "You're offline. We'll save the changes when you're online!"
        );
      }
      toast.error("Error creating menu item");
    }
  };

  const resetForm = () => {
    setForm({
      priority: 1,
      body: "",
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((form) => ({
      ...form,
      [name]: name === "priority" ? Number(value) : value,
    }));
  };

  return (
    <Layout>
      <form onSubmit={handleForm} className="space-y-2">
        <div className="flex justify-start mb-20">
          <Link to={ROUTES.menuItems} className="mt-4 w-full mr-auto flex gap-2">
            <IoArrowBack className="my-auto text-xl" /> Back
          </Link>
        </div>

        <div>
          <input
            type="text"
            name="body"
            value={form.body}
            onChange={handleChange}
            placeholder="Add a Task..."
            className={inputClassName}
          />
        </div>

        <div>
          <input
            type="number"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        <div className="flex">
          <button
            type="submit"
            className="bg-yellow-100 rounded-full py-3 w-40 text-black mx-auto"
          >
            Submit
          </button>
        </div>
      </form>
    </Layout>
  );
}

export default CreateMenuItem;
