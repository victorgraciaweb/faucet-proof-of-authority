
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { ethers } from "ethers";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const { ethereum } = window as any;

export function Transfer() {
  const [tx, setTx] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      from: "0x5d5357D2D6b567dFDc8A0CD5b15a877C40D13677",
      to: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
      amount: 1,
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner(data.from);
    const t = await signer.sendTransaction({
      to: data.to,
      value: ethers.parseEther(data.amount.toString()),
    });
    const tx = await t.wait();
    setTx({tx, t, data});
    setLoading(false);
  };
  return (
    <div className="space-y-4 mt-3">
      <h1 className="text-xl font-bold">Transfer</h1>
      <p>Transfer your money here</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuenta de origen</FormLabel>
                <FormControl>
                  <Input placeholder="0xc3d344646" {...field} />
                </FormControl>
                <FormDescription>Origen de la transacción</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuenta de destino</FormLabel>
                <FormControl>
                  <Input placeholder="0xc3d344646" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input placeholder="0xc3d344646" {...field} />
                </FormControl>
                <FormDescription>Cantidad</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            <Loader2 size={16} className={loading ? "animate-spin" : "hidden"} />
            Transfer</Button>
        </form>
      </Form>
      {tx && (
        <div>
          <h2>Transacción realizada</h2>
          <pre>{JSON.stringify(tx, null, 4)}</pre>
        </div>
      )}
    </div>
  );
}
