import OpenAI from "npm:openai";

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const openai = new OpenAI();

Deno.serve(async (req) => {
  const { prayer } = await req.json();
  // const data = {
  //   message: `Hello ${name}!`,
  // }

  console.log("prayer to answer: ", prayer);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Provide a string of KJV bible verse that relates to the prayer I sent you.`,
      },
      {
        role: "user",
        content: `${prayer}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  const response = completion.choices[0].message.content ?? "";
  console.log("completion: ", completion.choices[0]);
  console.log("response: ", response);

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
});
