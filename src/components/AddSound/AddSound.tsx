import { CategoryType } from "@prisma/client";
import { useState } from "react";
import { api } from "~/utils/api";
import { Formik } from "formik";
import { Select } from "../Controls/Select";
import Link from "next/link";

export const AddSound = ({
  initialValues,
}: {
  initialValues?: Partial<{
    name: string;
    category: CategoryType;
    tutorials: string[];
  }>;
}) => {
  const {
    name: initialName,
    category: initialCategory,
    tutorials,
  } = initialValues ?? {
    name: "",
    category: "BASS",
    tutorials: [],
  };
  const [name, setName] = useState(initialName ?? "");
  const [category, setCategory] = useState<CategoryType>(
    initialCategory ?? "BASS"
  );
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState<string[]>(tutorials ?? []);
  const mutation = api.beatboxDb.addBeatboxSound.useMutation();

  const addTutorial = () => {
    if (!url.includes("youtube.com")) {
      alert("Please enter a valid YouTube URL");
      return;
    }
    setUrls([...urls, url]);
    setUrl("");
  };

  const removeTutorial = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({
      name,
      category,
      tutorials: urls,
    });
  };

  return (
    <div className="w- flex flex-col gap-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <span className="text-xl font-bold">Add Sound:</span>
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="name">Name:</label>
          <input
            placeholder="My special sound"
            className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="category">Category:</label>
          <div className="w-full">
            <Select
              id="category"
              defaultValue={category}
              onChange={(e) => setCategory(e)}
              options={Object.values(CategoryType).map((category) => ({
                id: category,
                name: category,
              }))}
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="tutorial">Tutorial:</label>
          <input
            placeholder="https://www.youtube.com/watch?v=..."
            className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
            id="tutorial"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div id="tutorials" className="flex flex-col gap-2">
            {urls.map((url, i) => (
              <div key={`${url}-${i}`} className="flex gap-2">
                <span className=" w-3/4 max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600 ">
                  {url}
                </span>
                <button
                  className="w-1/4 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                  type="button"
                  onClick={() => removeTutorial(i)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="button" onClick={() => addTutorial()}>
          Add Tutorial
        </button>
        <button type="submit">Submit</button>
      </form>
      {mutation.isLoading && <span>Loading...</span>}
      {mutation.isError && <span>Error: {mutation.error.message}</span>}
      {mutation.isSuccess && mutation.data.id && (
        <>
          <span>Success!</span>
          <Link
            href={{
              pathname: `/sound/${name}`,
              query: { id: mutation.data.id },
            }}
          >
            View Sound
          </Link>
        </>
      )}
    </div>
  );
};

// <Formik
//   initialValues={{ email: "", password: "" }}
//   validate={(values) => {
//     const errors = { email: undefined } as { email: string | undefined };
//     if (!values.email) {
//       errors.email = "Required";
//     } else if (
//       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
//     ) {
//       errors.email = "Invalid email address";
//     }
//     return errors;
//   }}
//   onSubmit={(values, { setSubmitting }) => {
//     setTimeout(() => {
//       alert(JSON.stringify(values, null, 2));
//       mutation.mutate({
//         name,
//         category,
//         tutorials: urls,
//       });
//       setSubmitting(false);
//     }, 400);
//   }}
// >
//   {({
//     values,
//     errors,
//     touched,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     isSubmitting,
//     /* and other goodies */
//   }) => (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="email"
//         name="email"
//         onChange={handleChange}
//         onBlur={handleBlur}
//         value={values.email}
//       />
//       {errors.email && touched.email && errors.email}
//       <input
//         type="password"
//         name="password"
//         onChange={handleChange}
//         onBlur={handleBlur}
//         value={values.password}
//       />
//       {errors.password && touched.password && errors.password}
//       <button type="submit" disabled={isSubmitting}>
//         Submit
//       </button>
//     </form>
//   )}
// </Formik>
