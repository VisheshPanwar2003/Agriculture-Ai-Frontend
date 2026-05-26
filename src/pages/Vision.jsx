import { useState, useRef, useEffect } from "react";

import axios from "axios";

import {
  Upload,
  Sparkles,
  Bot,
  User,
} from "lucide-react";

export default function VisionAnalysis() {

  const [image, setImage] = useState(null);

  const [imageFile, setImageFile] =
    useState(null);

  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState([]);

  const messagesEndRef = useRef(null);

  // AUTO SCROLL
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // IMAGE UPLOAD
  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (file) {

      setImage(
        URL.createObjectURL(file)
      );

      setImageFile(file);
    }
  };

  // ANALYZE IMAGE
  const analyzeVision = async () => {

    if (!imageFile || !question.trim())
      return;

    // ADD USER MESSAGE
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append(
        "file",
        imageFile
      );

      formData.append(
        "question",
        question
      );

      const response = await axios.post(
        "http://127.0.0.1:8000/vision/analyze",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      // ADD AI RESPONSE
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            response.data.response,
        },
      ]);

      setQuestion("");

    } catch (error) {

      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong while analyzing the image.",
        },
      ]);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-5 min-h-0">

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">

        {/* LEFT PANEL */}
        <div className="col-span-4 min-h-0">

          <div
            className="
            bg-[#041b14]
            rounded-3xl
            p-5
            h-full
            flex
            flex-col
            "
          >

            {/* SECTION 1 */}
            <div>

              <h2 className="text-green-400 font-semibold mb-4">
                1. Upload Image
              </h2>

              {/* UPLOAD BOX */}
              <label
                className="
                relative
                flex-1
                min-h-[260px]
                rounded-2xl
                bg-[#061d16]
                flex
                flex-col
                items-center
                justify-center
                cursor-pointer
                overflow-hidden
                hover:bg-[#0a241c]
                transition-all
                duration-300
                "
              >

                {/* IMAGE */}
                {image ? (
                  <>
                    <img
                      src={image}
                      alt="preview"
                      className="
                      absolute
                      inset-0
                      w-full
                      h-full
                      object-cover
                      "
                    />

                    {/* OVERLAY */}
                    <div
                      className="
                      absolute
                      inset-0
                      bg-black/40
                      opacity-0
                      hover:opacity-100
                      transition-all
                      duration-300
                      flex
                      items-center
                      justify-center
                      "
                    >
                      <div
                        className="
                        px-4
                        py-2
                        rounded-xl
                        bg-black/60
                        text-white
                        "
                      >
                        Replace Image
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center px-6">

                    <Upload
                      size={50}
                      className="text-green-400 mx-auto mb-5"
                    />

                    <h3 className="text-lg font-medium">
                      Drag & drop an image here
                    </h3>

                    <p className="text-gray-400 mt-2">
                      or click to browse
                    </p>

                    <p className="text-sm text-gray-500 mt-6">
                      Supports: JPG, PNG, WebP • Max 10MB
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  className="hidden"
                  onChange={
                    handleImageUpload
                  }
                />
              </label>
            </div>

            {/* SECTION 2 */}
            <div className="mt-5">

              <h2 className="text-green-400 font-semibold mb-4">
                2. Ask About Image
              </h2>

              <textarea
                placeholder={`e.g. What disease does this plant have?\nHow severe is it?`}
                value={question}
                onChange={(e) =>
                  setQuestion(
                    e.target.value
                  )
                }
                className="
                w-full
                h-[100px]
                rounded-2xl
                bg-[#061d16]
                p-4
                outline-none
                resize-none
                text-white
                placeholder:text-gray-500
                hover:bg-[#0a241c]
                focus:bg-[#0a241c]
                transition-all
                duration-300
                "
              />

              {/* BUTTON */}
              <button
                onClick={analyzeVision}
                disabled={loading}
                className="
                mt-2
                w-full
                py-4
                rounded-2xl
                bg-green-700
                hover:bg-green-600
                disabled:opacity-60
                transition-all
                duration-300
                flex
                items-center
                justify-center
                gap-3
                font-medium
                "
              >
                <Sparkles size={18} />

                {
                  loading
                    ? "Analyzing..."
                    : "Analyze with Vision AI"
                }
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-8 min-h-0">

          <div
            className="
            bg-[#041b14]
            rounded-3xl
            p-5
            h-full
            flex
            flex-col
            overflow-hidden
            "
          >

            {/* HEADER */}
            <div className="pb-4 shrink-0">

              <h2 className="text-green-400 font-semibold">
                Vision AI Conversation
              </h2>
            </div>

            {/* CHAT */}
            <div
              className="
              flex-1
              overflow-y-auto
              space-y-6
              pr-2
              "
            >

              {
                messages.length === 0 ? (

                  <div className="h-full flex items-center justify-center">

                    <div className="text-center">

                      <div
                        className="
                        w-32
                        h-32
                        rounded-full
                        bg-[#061d16]
                        flex
                        items-center
                        justify-center
                        mx-auto
                        "
                      >
                        <Sparkles
                          size={60}
                          className="text-green-400"
                        />
                      </div>

                      <h2 className="text-2xl font-semibold mt-6">
                        Vision AI Ready
                      </h2>

                      <p className="text-gray-400 mt-3 leading-relaxed">
                        Upload an image and ask questions
                        <br />
                        about your crop or plant.
                      </p>
                    </div>
                  </div>

                ) : (

                  messages.map(
                    (msg, index) => (

                      <div
                        key={index}
                        className={`
                        flex
                        ${
                          msg.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }
                        `}
                      >

                        <div
                          className={`
                          max-w-[80%]
                          rounded-2xl
                          px-5
                          py-4
                          ${
                            msg.role === "user"
                              ? "bg-green-700 text-white"
                              : "bg-[#061d16] border border-green-900"
                          }
                          `}
                        >

                          {/* TOP */}
                          <div className="flex items-center gap-2 mb-3">

                            {
                              msg.role === "assistant" ? (
                                <Bot
                                  size={18}
                                  className="text-green-400"
                                />
                              ) : (
                                <User size={18} />
                              )
                            }

                            <p className="text-sm font-medium">
                              {
                                msg.role === "assistant"
                                  ? "Vision AI"
                                  : "You"
                              }
                            </p>
                          </div>

                          {/* MESSAGE */}
                          <p className="leading-relaxed whitespace-pre-wrap text-gray-200">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    )
                  )
                )
              }

              {/* LOADING */}
              {
                loading && (

                  <div className="flex justify-start">

                    <div
                      className="
                      bg-[#061d16]
                      border
                      border-green-900
                      rounded-2xl
                      px-5
                      py-4
                      "
                    >

                      <div className="flex gap-2">

                        <div
                          className="
                          w-2
                          h-2
                          rounded-full
                          bg-green-400
                          animate-bounce
                          "
                        />

                        <div
                          className="
                          w-2
                          h-2
                          rounded-full
                          bg-green-400
                          animate-bounce
                          delay-100
                          "
                        />

                        <div
                          className="
                          w-2
                          h-2
                          rounded-full
                          bg-green-400
                          animate-bounce
                          delay-200
                          "
                        />
                      </div>
                    </div>
                  </div>
                )
              }

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}