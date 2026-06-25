import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  TaskList: undefined;
  TaskDetails: { taskId: string };
  AddTask: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
