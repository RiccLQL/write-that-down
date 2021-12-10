import React, { useState } from 'react';
import { Button } from 'react-native';
import DatePicker from 'react-native-date-picker';

export interface DateProps {
    onChange: (date: Date) => void;
}

export const DateInput = (props: DateProps): JSX.Element => {
  const [date, setDate] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button title="Open" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
    </>
  )
}