# 🧠 Sentence Construction Quiz

An interactive and timed sentence construction quiz built using **React**, **Tailwind CSS**, and **Framer Motion**. This app challenges users to complete sentences by selecting the correct words within a time limit. It is a part of a learning or testing platform and designed with a focus on user experience, feedback, and score tracking.

---

## 🚀 Features

- ⏱ **Timer-based quiz**: 30 seconds per question.
- ✍️ **Dynamic sentence construction** with fill-in-the-blanks style.
- 🎨 **Animated transitions** using Framer Motion.
- ✅ Instant **correct/incorrect feedback** on submission.
- 📊 Final **score summary** with correct and user answers.
- 🔁 Option to **restart the quiz** or **quit anytime**.
- 🔎 **Responsive UI** designed with Tailwind CSS.

---

## 🧰 Tech Stack

| Tech           | Description                              |
|----------------|------------------------------------------|
| React          | Frontend JavaScript library              |
| Tailwind CSS   | Utility-first CSS framework              |
| Framer Motion  | Animation library for React              |
| Lucide Icons   | Icon library used for visual cues        |
| Vite/Next.js   | (If applicable) React build environment  |

---

## 📂 Project Structure

src/ ├── components/ │ ├── ui/ # Reusable UI components (Card, Button, Progress) ├── lib/ │ └── data.js # Test questions and answer data ├── pages/ │ └── SentenceConstruction.jsx # Main quiz component


---

## 🧪 How It Works

1. User clicks **Start** to begin the quiz.
2. Each question has a sentence with blanks (`__________`) and multiple word options.
3. The user must **drag/select** the right words to fill in the blanks before the **timer expires**.
4. Each answer is validated and stored.
5. At the end, the **score and detailed feedback** are displayed.
6. The user can **try again** or exit.

---


## 📦 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/rajkumarojhaa/Sentence-Construction

# Navigate into the project directory
cd sentence-construction

# Install dependencies
npm install

# Start the development server
npm run dev

✨ Author
Made with ❤️ by Rajkumar Ojha
