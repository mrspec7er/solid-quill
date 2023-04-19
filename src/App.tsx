import {
  createSignal,
  type Component,
  createEffect,
  Setter,
  For,
  Show,
} from "solid-js";
import Quill from "quill";
import { SolidQuill } from "solid-quill";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import {
  Routes,
  useParams,
  Route,
  Router,
  Link,
  useNavigate,
} from "@solidjs/router";

import { createClient } from "@supabase/supabase-js";

const DirectionAttribute = Quill.import("attributors/attribute/direction");
const AlignClass = Quill.import("attributors/class/align");
const BackgroundClass = Quill.import("attributors/class/background");
const ColorClass = Quill.import("attributors/class/color");
const DirectionClass = Quill.import("attributors/class/direction");
const FontClass = Quill.import("attributors/class/font");
const SizeClass = Quill.import("attributors/class/size");
const AlignStyle = Quill.import("attributors/style/align");
const BackgroundStyle = Quill.import("attributors/style/background");
const SizeStyle = Quill.import("attributors/style/size");
const FontStyle = Quill.import("attributors/style/font");
const ColorStyle = Quill.import("attributors/style/color");
const DirectionStyle = Quill.import("attributors/style/direction");

Quill.register(DirectionAttribute, true);
Quill.register(AlignClass, true);
Quill.register(BackgroundClass, true);
Quill.register(ColorClass, true);
Quill.register(DirectionClass, true);
Quill.register(FontClass, true);
Quill.register(SizeClass, true);
Quill.register(AlignStyle, true);
Quill.register(BackgroundStyle, true);
Quill.register(ColorStyle, true);
Quill.register(DirectionStyle, true);
Quill.register(FontStyle, true);
Quill.register(SizeStyle, true);

const supabase = createClient(
  import.meta.env.VITE_PROJECT_URL,
  import.meta.env.VITE_ANON_KEY
);

const App: Component = () => {
  return (
    <Router>
      <Routes>
        <Route path={"/create"} component={ModifyEmail} />
        <Route path={"/update/:id"} component={ModifyEmail} />
        <Route path={"/"} component={EmailList} />
      </Routes>
    </Router>
  );
};

export default App;

const ModifyEmail: Component = () => {
  let quill: Quill | undefined;
  const { id } = useParams();

  createEffect(async () => {
    if (id) {
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .eq("id", Number(id))
        .maybeSingle();
      if (error) {
        console.log(error);
      }

      if (data) {
        quill?.setContents(JSON.parse(data.body));
      }
    }
  });

  async function handleModifyEmail() {
    const body = {
      reciver: "miracle8oys@gmail.com",
      subject: "TESTING",
      body: JSON.stringify(quill?.getContents()),
      status: false,
    };

    if (!id) {
      const { data, error } = await supabase.from("emails").insert({ ...body });
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
      }
    }

    if (id) {
      const { data, error } = await supabase
        .from("emails")
        .update({ ...body })
        .eq("id", Number(id));
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
      }
    }
  }

  async function handleSendEmail() {
    console.log(quill?.root.innerHTML);
  }
  return (
    <div class="container mx-auto mt-7 mb-32">
      <SolidQuill
        as="main"
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [
              { align: "" },
              { align: "center" },
              { align: "justify" },
              { align: "right" },
            ],

            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],

            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["link", "image", "video"],
            [{ color: [] }, { background: [] }],

            ["clean"],
          ],
        }}
        placeholder="Text editor"
        theme="snow"
        ref={quill}
        strict={true}
        class="quill"
        classList={{ active: true }}
      />
      <div class="flex justify-between">
        <button onclick={handleModifyEmail}>Save as draf</button>
        <button onclick={handleSendEmail}>Send Email</button>
      </div>
    </div>
  );
};

const EmailList: Component = () => {
  const [showActionModal, setShowActionModal] = createSignal(0);
  createEffect(() => console.log(showActionModal()));
  return (
    <div class="relative overflow-x-auto shadow-md min-h-screen bg-gray-800">
      <div class="container mx-auto flex items-center justify-between py-4">
        <div>
          <button
            id="dropdownActionButton"
            data-dropdown-toggle="dropdownAction"
            class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button"
          >
            <span class="sr-only">Action button</span>
            Action
            <svg
              class="w-3 h-3 ml-2"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {/* <!-- Dropdown menu --> */}
          <div
            id="dropdownAction"
            class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
          >
            <ul
              class="py-1 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownActionButton"
            >
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Reward
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Promote
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Activate account
                </a>
              </li>
            </ul>
            <div class="py-1">
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Delete User
              </a>
            </div>
          </div>
        </div>
        <label for="table-search" class="sr-only">
          Search
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search-users"
            class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for users"
          />
        </div>
      </div>
      <table class="w-full container mx-auto text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Name
            </th>
            <th scope="col" class="px-6 py-3">
              Position
            </th>
            <th scope="col" class="px-6 py-3">
              Status
            </th>
            <th scope="col" class="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <For each={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}>
            {(i) => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th
                  scope="row"
                  class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    class="w-10 h-10 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-4.jpg"
                    alt="Jese image"
                  />
                  <div class="pl-3">
                    <div class="text-base font-semibold">Neil Sims</div>
                    <div class="font-normal text-gray-500">
                      neil.sims@flowbite.com
                    </div>
                  </div>
                </th>
                <td class="px-6 py-4">React Developer</td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>{" "}
                    Online
                  </div>
                </td>
                <td class="px-6 py-4">
                  {/* <!-- Modal toggle --> */}
                  <button
                    onclick={() => setShowActionModal(i)}
                    type="button"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit user
                  </button>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <Show when={showActionModal()} keyed>
        <div
          tabIndex={-1}
          onclick={() => setShowActionModal(0)}
          class="absolute right-0 left-0 top-0 z-50 w-screen flex justify-center items-center p-4 overflow-x-hidden overflow-y-auto h-full"
        >
          <div class="w-full h-full max-w-sm md:h-auto">
            {/* <!-- Modal content --> */}
            <div class="bg-white rounded-lg shadow dark:bg-gray-700">
              {/* <!-- Modal body --> */}
              <div class="py-5 text-white">
                <Link
                  onclick={(e) => e.stopPropagation()}
                  class="p-2 hover:bg-slate-500 w-11/12 mx-auto flex justify-center px-2 rounded-lg"
                  href={"/update/" + showActionModal()}
                >
                  Edit
                </Link>

                <Link
                  class="p-2 hover:bg-slate-500 w-11/12 mx-auto flex justify-center px-2 rounded-lg"
                  href="/"
                >
                  Delete
                </Link>

                <Link
                  class="p-2 hover:bg-slate-500 w-11/12 mx-auto flex justify-center px-2 rounded-lg"
                  href="/"
                >
                  Send
                </Link>
              </div>
              {/* <!-- Modal footer --> */}
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};
