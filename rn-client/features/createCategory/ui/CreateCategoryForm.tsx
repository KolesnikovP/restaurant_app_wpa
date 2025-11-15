import { ThemedText } from "@/shared/components/themed-text"
import { AppTextInput } from "@/shared/components/ui/AppTextInput/AppTextInput"
import { useEffect, useState } from "react"
import { Alert, TextInput, View } from "react-native"
import { createCategory } from "../services/createCategory"
import { AppButton } from "@/shared/components/ui/app-button"

type CreateCategoryFormProps = {
  environmentId: string
  onSubmit?: () => void;
}
export const CreateCategoryForm = (props: CreateCategoryFormProps) => {
  const { environmentId, onSubmit } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [categoryName, setCategoryName] = useState<string>('')
  const [category, setCategory] = useState()

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await createCategory(environmentId, categoryName)

      if(response) {
        console.log("RESPONSE>>>> ", response)
        setCategory(response)
        onSubmit && onSubmit()
      }
    } catch (error) {
      console.log('Error:', error)
      Alert.alert('Error', 'Something went wrong')
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View>
      <ThemedText>environmentId: {environmentId}</ThemedText>

      <AppTextInput
        value={categoryName}
        onChangeText={setCategoryName}
        placeholder="Category name"
        autoCapitalize="none"
      />
      <AppButton title={'submit'} onPress={handleSubmit} />
    </View>
  )
}
