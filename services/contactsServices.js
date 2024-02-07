import { promises as fs } from 'fs';
import { nanoid } from  "nanoid";
  

export const listContacts = async() => {
    const result = await fs.readFile('db/contacts.json');
    return JSON.parse(result);
  }

export const getContactById = async(contactId) => {
    const contact = await listContacts();
    const result = contact.find(item => item.id === contactId);

    return result || null;
  }
export const removeContact = async(contactId) => {
    const contact = await listContacts();
    const index = contact.findIndex(item => item.id === contactId);
    if(index === -1) {
        return null
    };
    
    const [result] = contact.splice(index, 1);

    await fs.writeFile('db/contacts.json', JSON.stringify(contact, null, 2));

    return result;

  }
export const addContact = async({name, email, phone}) => {
    const contact = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    };
    
    contact.push(newContact);
    await fs.writeFile('db/contacts.json', JSON.stringify(contact, null, 2));
    return newContact;

};

export const updateById = async(id, data) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === id);
    if(index === -1){
        return null;
    }
    const updatingContact = contacts.map(contact => 
     contact.id === id ? {...contact, ...data}: contact)
    await fs.writeFile('db/contacts.json', JSON.stringify(updatingContact, null, 2));
    return updatingContact[index];
}
