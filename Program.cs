using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
// Name: Harinder Singh
//Student ID: 1513751

namespace LAB3
{
    class Node
    {
        public int Data;
        public Node Next;

        public Node(int data)
        {
            this.Data = data;
            this.Next = null;
        }
    }
    class Queue
    {
        private Node front;
        private Node rear;

        public Queue()
        {
            front = rear = null;
        }

        // Adding item to queue
        public void Enqueue(int data)
        {
            Node newNode = new Node(data);

            if (rear == null)
            {
                front = rear = newNode;
            }
            else
            {
                rear.Next = newNode;
                rear = newNode;
            }
        }

        // Removing and returning front item
        public int Dequeue()
        {
            if (IsQueueEmpty())
                throw new InvalidOperationException("Queue is empty");

            int value = front.Data;
            front = front.Next;

            if (front == null)
                rear = null;
            return value;
        }

        // Return front item without removing
        public int Peek()
        {
            if (IsQueueEmpty())
                throw new InvalidOperationException("Queue is empty");
            return front.Data;
        }

        // Clearing the queue
        public void Clear()
        {
            front = rear = null;
            Console.WriteLine("The Queue is cleared");
        }

        // To check if queue is empty
        public bool IsQueueEmpty()
        {
            return front == null;
        }

        // Displaying Queue content
        public void Display()
        {
            if (IsQueueEmpty())
            {
                Console.WriteLine("Queue Empty");
                return;
            }
            Node current = front;
            Console.Write("Queue Content: ");
            while (current != null)
            {
                Console.Write(current.Data + " ");
                current = current.Next;
            }
            Console.WriteLine();
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            Queue queue = new Queue();
            bool running = true;
            while (running)
            {
                Console.WriteLine("\n Queue Operations Menu");
                Console.WriteLine("1.Enqueue");
                Console.WriteLine("2.Dequeue");
                Console.WriteLine("3.Peek");
                Console.WriteLine("4.Clear");
                Console.WriteLine("5.View Queue");
                Console.WriteLine("6.Exit");
                Console.Write("Select Mode (1-6): ");

                string input = Console.ReadLine();

                switch (input)
                {
                    case "1":
                        Console.Write("Enter number:");
                        if (int.TryParse(Console.ReadLine(), out int value))
                        {
                            queue.Enqueue(value);
                            Console.WriteLine($"{value} added to queue.");
                        }
                        else
                        {
                            Console.WriteLine("Invalid input.");
                        }
                        break;

                    case "2":
                        try
                        {
                            int removed = queue.Dequeue();
                            Console.WriteLine($"Removed: {removed}");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.Message);
                        }
                        break;

                    case "3":
                        try
                        {
                            int front = queue.Peek();
                            Console.WriteLine($"Front of the queue: {front}");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.Message);
                        }
                        break;

                    case "4":
                        queue.Clear();
                        break;

                    case "5":
                        queue.Display();
                        break;

                    case "6":
                        running = false;
                        break;

                    default:
                        Console.WriteLine("Invalid option. Please select 1-6.");
                        break;
                }
            }
        }
    }
}